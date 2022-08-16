import type { Report } from "@plantarium/backend";
import { send } from "./core";


export function getReport(reportId: string) {
  return send<Report>({ method: "GET", path: `api/report/${reportId}` });
}

export function publishReport(reportId: string) {
  return send({ method: "PUT", path: `api/report/${reportId}/publish` })
}

export function deleteReport(reportId: string) {
  return send({ method: "DELETE", path: `api/report/${reportId}` });
}

export function unpublishReport(reportId: string) {
  return send({ method: "PUT", path: `api/report/${reportId}/unpublish` })
}

export function getAvailableLabels() {
  return send<string[]>({ method: "GET", path: `api/report/labels` });
}

export function setReportLabels(reportId: string, labels: string[]) {
  return send({ method: "PUT", path: `api/report/${reportId}`, data: { labels } })
}

export function updateReport(reportId: string, data: Partial<Report>) {
  return send({ method: "PUT", path: `api/report/${reportId}`, data })
}
