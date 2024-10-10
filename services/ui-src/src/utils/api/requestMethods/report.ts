import { get, post, put } from "aws-amplify/api";
import { ReportKeys, ReportShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";
import { updateTimeout } from "utils";

const apiName = "mcr";

async function archiveReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/archive/${reportType}/${state}/${id}`;

  updateTimeout();
  await put({
    apiName,
    path,
    options,
  });
}

async function releaseReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/release/${reportType}/${state}/${id}`;

  updateTimeout();
  await put({
    apiName,
    path,
    options,
  });
}

async function submitReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/submit/${reportType}/${state}/${id}`;

  updateTimeout();
  const { body } = await post({
    apiName,
    path,
    options,
  }).response;
  return await body.json();
}

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  updateTimeout();
  const { body } = await get({
    apiName,
    path,
    options,
  }).response;
  return await body.json();
}

async function getReportsByState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/reports/${reportType}/${state}`;

  updateTimeout();
  const { body } = await get({
    apiName,
    path,
    options,
  }).response;
  return await body.json();
}

async function postReport(
  reportType: string,
  state: string,
  report: ReportShape
) {
  const requestHeaders = await getRequestHeaders();
  const options: any = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const path = `/reports/${reportType}/${state}`;

  updateTimeout();
  const { body } = await post({
    apiName,
    path,
    options,
  }).response;
  return await body.json();
}

async function putReport(reportKeys: ReportKeys, report: ReportShape) {
  const requestHeaders = await getRequestHeaders();
  const options: any = {
    headers: { ...requestHeaders },
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  updateTimeout();
  const { body } = await put({
    apiName,
    path,
    options,
  }).response;
  return await body.json();
}

export {
  archiveReport,
  releaseReport,
  getReport,
  postReport,
  putReport,
  getReportsByState,
  submitReport,
};
