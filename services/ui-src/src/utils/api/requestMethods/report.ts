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
  const restOperation = put({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
}

async function releaseReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/release/${reportType}/${state}/${id}`;

  updateTimeout();
  const restOperation = put({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
}

async function submitReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/submit/${reportType}/${state}/${id}`;

  updateTimeout();
  const restOperation = post({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
}

async function getReport(reportKeys: ReportKeys) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;

  updateTimeout();
  const restOperation = get({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
}

async function getReportsByState(reportType: string, state: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/reports/${reportType}/${state}`;

  updateTimeout();
  const restOperation = get({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
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
  const restOperation = post({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
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
  const restOperation = put({
    apiName,
    path,
    options,
  });
  return await restOperation.response;
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
