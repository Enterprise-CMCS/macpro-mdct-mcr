import { API } from "aws-amplify";
import { ReportKeys, ReportShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";
import { updateTimeout } from "utils";

async function archiveReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mcr",
    `/reports/archive/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function unlockReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mcr",
    `/reports/unlock/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.get(
    "mcr",
    `/reports/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

async function getReportsByState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get(
    "mcr",
    `/reports/${reportType}/${state}`,
    request
  );
  return response;
}

async function postReport(
  reportType: string,
  state: string,
  report: ReportShape
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };

  updateTimeout();
  const response = await API.post(
    "mcr",
    `/reports/${reportType}/${state}`,
    request
  );
  return response;
}

async function putReport(reportKeys: ReportKeys, report: ReportShape) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;

  updateTimeout();
  const response = await API.put(
    "mcr",
    `/reports/${reportType}/${state}/${id}`,
    request
  );
  return response;
}

export {
  archiveReport,
  unlockReport,
  getReport,
  postReport,
  putReport,
  getReportsByState,
};
