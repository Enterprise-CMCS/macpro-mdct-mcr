import { API } from "aws-amplify";
import { ReportDetails, ReportShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReport(reportDetails: ReportDetails) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportDetails;
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
  reportDetails: ReportDetails,
  reportStatus: ReportShape
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...reportStatus },
  };
  const { state, reportId } = reportDetails;
  const response = await API.post(
    "reports",
    `/reports/${state}/${reportId}`,
    request
  );
  return response;
}

async function deleteReport(reportDetails: ReportDetails) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportDetails;
  const response = await API.del(
    "reports",
    `/reports/${state}/${reportId}`,
    request
  );
  return response;
}

export { getReport, getReportsByState, writeReport, deleteReport };
