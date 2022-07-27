import { API } from "aws-amplify";
import { AnyObject } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReportStatus(reportKey: string, programName: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.get(
    "reportStatus",
    `/reportStatus/${reportKey}/${programName}`,
    request
  );
  return response;
}

async function writeReportStatus(reportData: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: reportData,
  };
  const response = await API.post(
    "reportStatus",
    `/reportStatus/${reportData.key}/${reportData.programName}`,
    request
  );
  return response;
}

export { getReportStatus, writeReportStatus };
