import { activeView } from '$lib/stores';
import api, { isLoggedIn } from '@plantarium/client-api';
import { createAlert, createToast } from '@plantarium/ui';
import { get } from 'svelte/store';
import { projectManager } from '..';
import * as projectStore from './project-store';
import { activeProject, isLoading, newIDS, state } from './stores';

export async function loadProject(id: string) {
  const s = get(state);

  if (s === 'remote') {
    return await projectStore.loadProject(id);
  }

  return await projectManager.getProject(id);
}

export async function publishProject(id: string) {
  if (!get(isLoggedIn)) {
    createToast('Must be logged in to publish', { type: 'warning' });
    return;
  }

  const answer = await createAlert('If you publish it, everyone can download it.', {
    title: 'Sure?',
    values: ['Yes', 'No']
  });
  if (answer !== 'Yes') {
    return;
  }

  const p = await loadProject(id);

  if (!p) return;

  const r = await api.publishProject(p);


  if (r.ok === true) {
    const newPrject = await projectManager.updateProject(id, { public: true, author: r?.data?.author as string });
    activeProject.set(newPrject)
    createToast('Published Project', { type: 'success' });
  } else {
    createToast(r.message, { type: 'error', title: 'Could not publish' });
  }
}

export async function deleteRemoteProject() {

}

export async function setActiveProject(id?: string) {
  if (!id) {
    activeProject.set(null);
    return;
  }

  if (get(isLoading)) {
    return;
  }

  newIDS.update((ids) => ids.filter((_id) => _id !== id));

  const projectPromise = loadProject(id);
  const t = setTimeout(() => isLoading.set(true), 500);
  projectPromise.then((project) => {
    activeProject.set(project ?? null);
    clearTimeout(t);
  });
}

export async function setProjectName(id: string, name: string) {
  await projectManager.updateProjectMeta(id, { name });
}

export async function downloadProject(id: string) {
  try {
    const project = await projectStore.loadProject(id);
    const p = await projectManager.createNew(project);
    createToast('Downloaded ' + project?.meta.name, { type: 'success' });

    newIDS.update((ids) => {
      ids.push(p.id);
      return ids;
    });

    return p;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProject(id: string) {
  const project = await loadProject(id);

  if (!project) return;

  const res = await createAlert(
    `Are you sure you want to delete ${project?.meta?.name || project.id}?`,
    {
      values: ['Yes', 'No']
    }
  );

  if (res === 'Yes') {
    newIDS.update((ids) => ids.filter((_id) => _id !== id));
    isLoading.set(true);
    await projectManager.deleteProject(project.id);
    isLoading.set(false);
    activeProject.set(null);
    createToast(`Project ${project.meta.name ?? project.id} deleted!`, {
      type: 'success'
    });
  }
}

export async function handleLike(projectId: string, like: boolean) {
  const p = await api[like ? 'likeProject' : 'unlikeProject'](projectId);

  if (p.ok) {
    const prj = p.data;
    console.log({ prj })
    projectStore.updateSingleProject(prj.id, { likes: prj.likes })
  }

}

export async function openProject(id: string) {
  newIDS.update((ids) => ids.filter((_id) => _id !== id));
  if (get(state) === 'remote') {
    const t = setTimeout(() => isLoading.set(true), 500);
    const project = await downloadProject(id);
    isLoading.set(false);
    clearTimeout(t);
    if (project) {
      projectManager.setActiveProject(project?.id);
      activeView.set('plant');
    }
  } else {
    projectManager.setActiveProject(id);
    activeView.set('plant');
  }
}
