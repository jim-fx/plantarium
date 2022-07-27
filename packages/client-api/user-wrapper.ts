import type { CreateReportDto, Project, Report, User } from "@plantarium/backend";
import { validator } from "@plantarium/helpers";
import { post, send } from "./core";
import store, { permissions, userStore } from "./store";
const { VITE_API_URL = 'http://localhost:8081' } = import.meta.env;

export async function login(username: string, password: string) {
  const res = await post('api/auth/login', { username, password });
  if (res.ok) {
    store.token = res.data.access_token;
  }
  return res
}

export async function oauth(provider: string) {

  const res = await post("api/auth/" + provider + "/register-token", {});

  if (res.ok) {

    const { token } = res.data;

    if (token && "open" in globalThis) {
      globalThis.open(VITE_API_URL + "/api/auth/" + provider + "/set-token/" + token, "__blank")
      const response = await post("api/auth/" + provider + "/token", { token })
      if (response.ok) {
        const { access_token } = response.data;
        store.token = access_token;
      }
    }
  }

}

export async function register(username: string, email: string, password: string) {
  const res = await post<{ access_token: string }>('api/user', { name: username, email, password });
  if (res.ok) {
    store.token = res.data.access_token;
  }
  return res;
}

export function logout() {
  store.token = '';
}

function roughSizeOfObject(object) {

  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    }
    else if (typeof value === 'string') {
      bytes += value.length * 2;
    }
    else if (typeof value === 'number') {
      bytes += 8;
    }
    else if
      (
      typeof value === 'object'
      && objectList.indexOf(value) === -1
    ) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}


export function submitReport(data: CreateReportDto) {
  console.log({ bytes: roughSizeOfObject(data) })
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
}

export async function getProjects(filter: Partial<ProjectFilter> = {}) {

  let query: string[][] = []
  let type = [];

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

export async function publishProject(project: Project) {

  const errors = validator.isPlantProject(project.data);

  if (errors?.length) {
    return {
      ok: false,
      statusCode: 400,
      message: errors[0]
    }
  }

  return send<Project>({ path: "api/project", method: "POST", data: project.data })
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
      s.role = response.data;
      return s
    })
  }
  return response;
}

export async function getPermission() {
  const response = await send<string[]>({ path: `api/user/permission` });
  console.log({ response })
  if (response.ok) {
    permissions.set(response.data);
    return response.data;
  }
}

export async function getHealth() {
  return send({ path: "health" })
}
