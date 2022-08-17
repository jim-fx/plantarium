import type { Project } from "@plantarium/backend";
import clientApi from "@plantarium/client-api";
import { writable } from "svelte/store";

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

  let projectString = "";

  const { meta } = project?.data || project;

  if (meta.name) projectString += "~ " + meta.name;
  if (meta.description) projectString += "~ " + meta.description;
  if (meta.scientificName) projectString += "~ " + meta.scientificName;
  if (meta.family) projectString += "~ " + meta.family;
  if (meta.author) projectString += "~ " + meta.author;
  if (meta.tags) {
    projectString += "~ " + meta.tags.join(" ");
  }

  if (projectString.toLowerCase().includes(searchTerm.toLowerCase())) return true;
  return false;
}

function applyFilter() {

  if (!projects.size) return;

  const outArray: Project[] = [];

  const acceptedTypes: number[] = []

  if (filter.official) {
    acceptedTypes.push(2);
  }

  if (filter.approved) {
    acceptedTypes.push(1)
  }

  if (filter.user) {
    acceptedTypes.push(0)
  }

  projects.forEach(project => {
    if (acceptedTypes.length) {
      if (!(acceptedTypes.includes(project.type))) return;
    }

    if (filter.search && filter.search.length) {
      if (!applySearchTerm(project, filter.search)) return;
    }

    outArray.push(project);
  })

  store.set(outArray)

}

export async function loadPlant(id: string) {

  if (projects.has(id)) { return projects.get(id) };

  const res = await clientApi.getProject(id);

  if (res.ok) {
    projects.set(res.data._id, res.data);
    return res.data;
  }

}

export async function setFilter(f: Partial<ProjectFilter>, isOnline = false) {

  filter = f;
  applyFilter();

  if (isOnline) {

    const res = await clientApi.getProjects({ ...filter, exclude: [...projects.keys()] });

    if (res.ok) {
      res.data.forEach(p => {
        projects.set(p._id || p["id"], p)
      })
      applyFilter()
      return { ok: true, data: store }
    }
  }

}
