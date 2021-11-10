import { send,post,store, del } from "./core";

export async function login(username: string, password: string) {
  const res = await post('api/auth/login', { username, password });
  store.token = res.access_token;
}

export function logout() {
  store.token = '';
}

export function submitReport(data: any) {
  return send({ method: "POST", path: `api/report`, data })
}

export function deleteReport(reportId:string){
  return del(`api/report/${reportId}`); 
}
