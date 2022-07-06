import type { Project } from "@plantarium/backend";
import clientApi from "@plantarium/client-api";
import { writable } from "svelte/store";

const projects = new Map<string, Project>();

export const store = writable<Project[]>([]);

interface ProjectFilter {
  official: boolean;
  user: boolean;
  approved: boolean;
}
let filter: Partial<ProjectFilter>;

function applyFilter() {

  if (!projects.size) return;

  let outArray: Project[] = [];

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
      if (!(acceptedTypes.includes(project.type || 0))) return;
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

export async function setFilter(f: Partial<ProjectFilter>) {

  filter = f;
  applyFilter();

  const res = await clientApi.getProjects({ ...filter });

  if (res.ok) {
    res.data.forEach(p => {
      try {
        p.data = JSON.parse(p.data as unknown as string);
      } catch (err) { }
      projects.set(p._id, p)
    })
    applyFilter()
    return { ok: true, data: store }
  }

}
