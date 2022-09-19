import { API } from "aws-amplify";
import { ReportKeys, ReportMetadataShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportKeys;
  const response = await API.get(
    "reports",
    `/reports/${state}/${reportId}`,
    request
  );
  return response;
}

async function getReportsByState(state: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.get("reports", `/reports/${state}`, request);
  return response;
}

async function writeReport(
  reportKeys: ReportKeys,
  reportMetadata: ReportMetadataShape
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...reportMetadata },
  };
  const { state, reportId } = reportKeys;
  const response = await API.post(
    "reports",
    `/reports/${state}/${reportId}`,
    request
  );
  return response;
}

async function deleteReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportKeys;
  const response = await API.del(
    "reports",
    `/reports/${state}/${reportId}`,
    request
  );
  return response;
}

export { getReport, getReportsByState, writeReport, deleteReport };
