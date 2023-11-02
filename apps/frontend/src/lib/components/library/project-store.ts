import clientApi from '@plantarium/client-api';
import type { Project } from '@plantarium/types';
import { get, writable } from 'svelte/store';
import { state } from './stores';

const projects = new Map<string, Project>();

export const store = writable<Project[]>([]);

interface ProjectFilter {
  official: boolean;
  user: boolean;
  approved: boolean;
  search: string;
}
let filter: Partial<ProjectFilter>;

export function applySearchTerm(project: Project, searchTerm: string) {
  let projectString = '';

  const { meta, author } = project;

  if (meta.name) projectString += '~ ' + meta.name;
  if (meta.description) projectString += '~ ' + meta.description;
  if (meta.scientificName) projectString += '~ ' + meta.scientificName;
  if (meta.family) projectString += '~ ' + meta.family;
  if (author) projectString += '~ ' + author;
  // if (meta.tags) {
  //   projectString += "~ " + meta.tags.join(" ");
  // }

  if (projectString.toLowerCase().includes(searchTerm.toLowerCase())) return true;
  return false;
}

function applyFilter() {
  if (!projects.size) return;

  const outArray: Project[] = [];

  const acceptedTypes: number[] = [];

  if (filter.official) {
    acceptedTypes.push(2);
  }

  if (filter.approved) {
    acceptedTypes.push(1);
  }

  if (filter.user) {
    acceptedTypes.push(0);
  }

  projects.forEach((project) => {
    if (acceptedTypes.length) {
      if (!acceptedTypes.includes(project.type)) return;
    }

    if (filter.search && filter.search.length) {
      if (!applySearchTerm(project, filter.search)) return;
    }

    outArray.push(project);
  });

  store.set(outArray);
}

export async function loadProject(id: string) {
  if (projects.has(id)) {
    return projects.get(id);
  }

  const res = await clientApi.getProject(id);

  if (res.ok) {
    projects.set(res.data.id, res.data);
    return res.data;
  }
}

export async function setFilter(f: Partial<ProjectFilter>) {
  filter = f;
  applyFilter();

  if (get(state) === 'remote') {
    const res = await clientApi.getProjects({ ...filter, exclude: [...projects.keys()] });

    if (res.ok) {
      res.data.forEach((p) => {
        projects.set(p.id, p);
      });
      applyFilter();
      return { ok: true, data: store };
    }
  }
}

export async function updateSingleProject(id: string, updateProject: Partial<Project>) {

  const project = projects.get(id);
  if (!project) return;
  projects.set(id, { ...project, ...updateProject })

}
