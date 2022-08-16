import * as api from '@plantarium/client-api';


export async function load({ params }) {
  const response = await api.getProject(params.projectId);

  console.log({ response, params })

  if (response.ok) {
    const plant = JSON.parse(response.data.data as unknown as string);

    return {
      project: response.data,
      plant,
    };
  } else {
    throw new Error(response.message);
  }
}
