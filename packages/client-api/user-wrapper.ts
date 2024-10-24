import type { CreateReportDto, Report, User } from "@plantarium/backend";
import { cloneObject, validator } from "@plantarium/helpers";
import type { Project } from "@plantarium/types";
import { ErrorResponse, post, send } from "./core";
import store, { permissions, userStore } from "./store";
const { VITE_API_URL = 'http://localhost:8081' } = import.meta.env;

export async function login(username: string, password: string) {
  const res = await post<{ access_token: string }>('api/auth/login', { username, password });
  if (res.ok) {
    store.token = res.data.access_token;
  }
  return res
}

export async function oauth(provider: string) {

  const res = await post<{ token: string }>("api/auth/" + provider + "/register-token", {});

  if (res.ok) {

    const { token } = res.data;

    if (token && "open" in globalThis) {
      globalThis.open(VITE_API_URL + "/api/auth/" + provider + "/set-token/" + token, "__blank")
      const response = await post<{ access_token: string }>("api/auth/" + provider + "/token", { token })
      if (response.ok) {
        const { access_token } = response.data;
        store.token = access_token;
      }
    }
  }

}

export async function register(username: string, email: string, password: string) {
  const res = await post<{ access_token: string }>('api/user', { username, email, password });
  if (res.ok) {
    store.token = res.data.access_token;
  }
  return res;
}

export function logout() {
  store.token = '';
}

export function submitReport(data: CreateReportDto) {
  return send<Report>({ method: "POST", path: `api/report`, data })
}

export function getReports() {
  return send<Report[]>({ path: "api/report" })
}

export async function getUserInfo() {
  return await send<User>({ path: "api/user/profile" })
}

export function getUserNameExists(name: string) {
  return send<boolean>({ path: "api/user/exists/" + name })
}

export function getProject(id: string) {
  return send<Project>({ path: "api/project/" + id });
}

interface ProjectFilter {
  user: boolean;
  official: boolean;
  approved: boolean;
  name: string;
  offset: number;
  exclude: string[];
}

export async function getProjects(filter: Partial<ProjectFilter> = {}) {

  const query: string[][] = []
  const type = [];

  if (filter.official) {
    type.push(2)
  }

  if (filter.approved) {
    type.push(1)
  }

  if (filter.user) {
    type.push(0)
  }

  if (type.length) {
    query.push(...type.map(t => ["type", "" + t]))
  }

  const res = await send<Project[]>({ path: "api/project?" + query.map(q => q.join("=")).join("&") });
  if (!res.ok) return res;

  return {
    ok: true,
    data: res.data.map(p => {
      p.type = parseInt(p.type + "");
      return p
    })
  }

}

export interface GbifResult<T> {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  results: T[];
}

export interface GbifMedia {
  type: string;
  format: string;
  source: string;
  created: Date;
  license: string;
  rightsHolder: string;
  taxonKey: number;
  sourceTaxonKey: number;
  identifier: string;
}


export function getImagesForPlant(gbifId: number) {
  return send<GbifResult<GbifMedia>>({ path: "api/project/gbif/media/" + gbifId });
}

export function getEmailExists(email: string) {
  return send<boolean>({ path: "api/user/existsEmail/" + email })
}

export async function publishProject(_p: Project) {
  const project = cloneObject(_p);

  project.createdAt = typeof project.createdAt === "string" ? project.createdAt : project.createdAt.toISOString() as unknown as Date;
  project.updatedAt = typeof project.updatedAt === "string" ? project.updatedAt : project.updatedAt.toISOString() as unknown as Date;

  const errors = validator.isPlantProject(project);

  if (errors?.length) {
    return {
      ok: false,
      statusCode: 400,
      message: errors[0]
    } as ErrorResponse;
  }

  return send<Project>({ path: "api/project", method: "POST", data: project })
}

export async function likeProject(id: string) {
  return send<Project>({ path: `api/project/${id}/like`, method: "PUT" })
}

export async function unlikeProject(id: string) {
  return send<Project>({ path: `api/project/${id}/like`, method: "DELETE" })
}

export async function deleteProject(id: string) {
  return send<string>({ path: "api/project/" + id, method: "DELETE" });
}

export async function getRole() {
  const response = await send<string>({ path: "api/user/role", isJSON: false });
  if (response.ok) {
    userStore.update(s => {
      s.role = response.data as User["role"];
      return s
    })
  }
  return response;
}

export async function getPermission() {
  const response = await send<string[]>({ path: `api/user/permission` });
  if (response.ok) {
    permissions.set(response.data);
    return response.data;
  }
}

const userCache = new Map<string, string>();
export async function getUserName(id: string): Promise<string> {

  if (userCache.has(id)) return userCache.get(id);

  const response = await send<User>({ path: `api/user/${id}` });

  if (response.ok === true) {
    userCache.set(id, response.data.username)
    return response.data.username;
  }

  throw new Error(response.message)
}

export async function getHealth() {
  return send({ path: "health" })
}


