import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReport(reportKey: any) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.get("reports", `/reports/${reportKey}`, request);
  return response;
}

async function writeReport(reportData: any) {
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

export { getReport, writeReport };
