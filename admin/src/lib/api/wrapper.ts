import { send, store} from "./send";

export async function login(username: string, password: string) {
  const res = await post('api/auth/login', { username, password });
  store.token = res.access_token;
}

export function logout() {
  store.token = '';
}

export function get(path: string) {
  return send({ method: 'GET', path });
}

export function del(path: string) {
  return send({ method: 'DELETE', path });
}

export function post(path: string, data: any) {
  return send({ method: 'POST', path, data });
}

export function put(path: string, data: any) {
  return send({ method: 'PUT', path, data });
}

export function getReport(reportId:string){
  return send({method:"GET", path: `api/report/${reportId}`});
}

export function publishReport(reportId:string){
  return send({method:"PUT", path:`api/report/${reportId}/publish`})
}

export function unpublishReport(reportId:string){
  return send({method:"PUT", path:`api/report/${reportId}/unpublish`})
}

export function getAvailableLabels(){
  return send({method:"GET", path:`api/report/labels`});
}

export function setReportLabels(reportId:string,labels:string[]){
  return send({method:"PUT", path:`api/report/${reportId}`, data: {labels}})
}
