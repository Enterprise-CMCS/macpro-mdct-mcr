import { API } from "aws-amplify";
import { ReportKeys, ReportShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";
import { updateTimeout } from "utils";

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, id } = reportKeys;

  updateTimeout();
  const response = await API.get("mcrApi", `/reports/${state}/${id}`, request);
  return response;
}

async function getReportsByState(state: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get("mcrApi", `/reports/${state}`, request);
  return response;
}

async function postReport(state: string, report: ReportShape) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };

  updateTimeout();
  const response = await API.post("mcrApi", `/reports/${state}`, request);
  return response;
}

async function putReport(reportKeys: ReportKeys, report: ReportShape) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { state, id } = reportKeys;

  updateTimeout();
  const response = await API.put("mcrApi", `/reports/${state}/${id}`, request);
  return response;
}

export { getReport, postReport, putReport, getReportsByState };
