import { userStore } from "./user-store";
import { send, post, store, get } from "./core";
import type { CreateReportDto, Report, User } from "@plantarium/backend";
const { VITE_API_URL = 'http://localhost:8081' } = import.meta.env;


export async function login(username: string, password: string) {
  const res = await post('api/auth/login', { username, password });
  store.token = res.access_token;
  return res;
}

export async function oauth(provider: string) {

  const { token } = await post("api/auth/" + provider + "/register-token", {});

  if (token && "open" in globalThis) {
    globalThis.open(VITE_API_URL + "/api/auth/" + provider + "/set-token/" + token, "__blank")
    const response = await post("api/auth/" + provider + "/token", { token })
    if (response.access_token) {
      store.token = response.access_token;
    }
  }

}

export async function register(username: string, email: string, password: string) {
  const res = await post('api/user', { name: username, email, password });
  store.token = res.access_token;
  return res;
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

export function getUserInfo(): Promise<User> {
  return send({ method: "GET", path: "api/profile" })
}

export function getUserNameExists(name: string): Promise<boolean> {
  return send({ method: "GET", path: "api/user/exists/" + name })
}

export function getEmailExists(email: string): Promise<boolean> {
  return send({ method: "GET", path: "api/user/existsEmail/" + email })
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
