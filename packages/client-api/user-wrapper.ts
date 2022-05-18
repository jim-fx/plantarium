import { userStore } from "./user-store";
import { send, post, store, del, get } from "./core";
import type { CreateReportDto, Report } from "@plantarium/backend";


export async function login(username: string, password: string) {
  const res = await post('api/auth/login', { username, password });
  store.token = res.access_token;
}

export function logout() {
  store.token = '';
}

export function submitReport(data: CreateReportDto) {
  return send({ method: "POST", path: `api/report`, data })
}

export function getReports(): Promise<Report[]> {
  return send({ method: "GET", path: "api/report" })
}

export async function getRole() {
  const role = await get(`api/user/role`, { isJSON: false }) as string;
  userStore.update(s => {
    s.role = role;
    return s
  })
  return role;

}

export async function getPermission() {
  const permissions = await get(`api/user/permission`) as unknown as string[];
  userStore.update(s => {
    s.permissions = permissions;
    return s
  })
  return permissions;
}
