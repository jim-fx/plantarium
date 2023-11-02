import * as api from '@plantarium/client-api';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const reportResponse = await api.getReport(params.reportId);
  if (!reportResponse.ok) {
    throw error(500);
  }
  let reportLabels = [];
  try {
    const reportLabelsResponse = await api.getAvailableLabels();
    if (reportLabelsResponse.ok) {
      reportLabels = reportLabelsResponse.data;
    }
  } catch (err) {
    console.log('Cant get report labels');
  }

  return {
    report: reportResponse.data,
    reportLabels: reportLabels,
  };
}
