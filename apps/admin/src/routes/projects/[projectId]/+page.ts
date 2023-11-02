import * as api from '@plantarium/client-api';

export async function load({ params }) {
  const response = await api.getProject(params.projectId);

  if (response.ok) {
    return {
      project: response.data,
    };
  }
}
