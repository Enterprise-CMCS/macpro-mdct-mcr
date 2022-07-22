import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";

async function writeReportToDb(reportData: any) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: reportData,
  };
  const response = await API.post(
    "reports",
    `/reports/${reportData.key}`,
    request
  );
  return response;
}

export { writeReportToDb };
