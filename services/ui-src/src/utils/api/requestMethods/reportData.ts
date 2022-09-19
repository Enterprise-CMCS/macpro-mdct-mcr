import { API } from "aws-amplify";
import { AnyObject, ReportKeys } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReportData(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportKeys;
  const response = await API.get(
    "reportData",
    `/reportData/${state}/${reportId}`,
    request
  );
  return response;
}

async function writeReportData(reportKeys: ReportKeys, fieldData: AnyObject) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: fieldData,
  };
  const { state, reportId } = reportKeys;
  const response = await API.post(
    "reportData",
    `/reportData/${state}/${reportId}`,
    request
  );
  return response;
}

export { getReportData, writeReportData };
