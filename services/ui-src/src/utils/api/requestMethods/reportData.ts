import { API } from "aws-amplify";
import { ReportDetails, ReportDataShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReportData(reportDetails: ReportDetails) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { state, reportId } = reportDetails;
  const response = await API.get(
    "reportData",
    `/reportData/${state}/${reportId}`,
    request
  );
  return response;
}

async function writeReportData(
  reportDetails: ReportDetails,
  reportData: ReportDataShape
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: reportData,
  };
  const { state, reportId } = reportDetails;
  const response = await API.post(
    "reportData",
    `/reportData/${state}/${reportId}`,
    request
  );
  return response;
}

export { getReportData, writeReportData };
