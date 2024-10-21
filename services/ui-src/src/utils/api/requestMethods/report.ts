import { ReportKeys, ReportShape } from "types";
import { get, post, put, updateTimeout } from "utils";

async function archiveReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/archive/${reportType}/${state}/${id}`;
  updateTimeout();
  return put<ReportShape>(path);
}

async function releaseReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/release/${reportType}/${state}/${id}`;
  updateTimeout();
  return put<ReportShape>(path);
}

async function submitReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/submit/${reportType}/${state}/${id}`;
  updateTimeout();
  return post<ReportShape>(path);
}

async function getReport(reportKeys: ReportKeys) {
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;
  updateTimeout();
  return get<ReportShape>(path);
}

async function getReportsByState(reportType: string, state: string) {
  const path = `/reports/${reportType}/${state}`;
  updateTimeout();
  return get<ReportShape[]>(path);
}

async function postReport(
  reportType: string,
  state: string,
  report: ReportShape
) {
  const options: any = {
    body: { ...report },
  };
  const path = `/reports/${reportType}/${state}`;
  updateTimeout();
  return post<ReportShape>(path, options);
}

async function putReport(reportKeys: ReportKeys, report: ReportShape) {
  const options: any = {
    body: { ...report },
  };
  const { reportType, state, id } = reportKeys;
  const path = `/reports/${reportType}/${state}/${id}`;
  updateTimeout();
  return put<ReportShape>(path, options);
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
