import { API } from "aws-amplify";
import { ReportKeys, ReportMetadata } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReportMetadata(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportKeys;
  const response = await API.get(
    "reportMetadata",
    `/reportMetadata/${state}/${reportId}`,
    request
  );
  return response;
}

async function writeReportMetadata(
  reportKeys: ReportKeys,
  reportMetadata: ReportMetadata
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

async function getReportsByState(state: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.get("reports", `/reports/${state}`, request);
  return response;
}

export {
  getReportMetadata,
  writeReportMetadata,
  deleteReport,
  getReportsByState,
};
