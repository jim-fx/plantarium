import { getReports } from "@plantarium/client-api";

export async function load() {

  try {
    const reportResponse = await getReports()
    if (reportResponse.ok) {
      return reportResponse.data;
    }

  } catch (error) {
    console.log(error)
  }


  return []
}
