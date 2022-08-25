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

	const r = await api.publishProject(p);
	p.public = true;

	if (r.ok === true) {
		createToast('Published Project', { type: 'success' });
	} else {
		createToast(r.message, { type: 'error', title: 'Could not publish' });
	}
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
		activeProject.set(project);
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
		createToast('Downloaded ' + project.meta.name, { type: 'success' });

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
	await api[like ? 'likeProject' : 'unlikeProject'](projectId);
}

export async function openProject(id: string) {
	newIDS.update((ids) => ids.filter((_id) => _id !== id));
	if (get(state) === 'remote') {
		const t = setTimeout(() => isLoading.set(true), 500);
		const project = await downloadProject(id);
		isLoading.set(false);
		clearTimeout(t);
		projectManager.setActiveProject(project.id);
		activeView.set('plant');
	} else {
		projectManager.setActiveProject(id);
		activeView.set('plant');
	}
}
