import store, { userStore } from "./store";
import { send, post } from "./core";
import type { CreateReportDto, Report, User } from "@plantarium/backend";
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

  console.log({ res })

  if (res.ok) {

    const { token } = res.data;

    if (token && "open" in globalThis) {
      globalThis.open(VITE_API_URL + "/api/auth/" + provider + "/set-token/" + token, "__blank")
      const response = await post("api/auth/" + provider + "/token", { token })
      console.log({ response })
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

export function getEmailExists(email: string) {
  return send<boolean>({ path: "api/user/existsEmail/" + email })
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
  if (response.ok) {

    userStore.update(s => {
      s.permissions = response.data;
      return s
    })
    return response.data;
  }
}
