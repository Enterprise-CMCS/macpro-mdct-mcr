import { API } from "aws-amplify";
import { AnyObject } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReport(reportKey: string, programName: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.get(
    "reports",
    `/reports/${reportKey}/${programName}`,
    request
  );
  return response;
}

async function writeReport(reportData: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: reportData,
  };
  const response = await API.post(
    "reports",
    `/reports/${reportData.key}/${reportData.programName}`,
    request
  );
  return response;
}

export { getReport, writeReport };
