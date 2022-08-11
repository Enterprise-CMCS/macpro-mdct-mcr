import { API } from "aws-amplify";
import { ReportDetails, ReportDataShape } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReport(reportDetails: ReportDetails) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { key, programName } = reportDetails;
  const response = await API.get(
    "reports",
    `/reports/${key}/${programName}`,
    request
  );
  return response;
}

async function writeReport(
  reportDetails: ReportDetails,
  reportData: ReportDataShape
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: reportData,
  };
  const { key, programName } = reportDetails;
  const response = await API.post(
    "reports",
    `/reports/${key}/${programName}`,
    request
  );
  return response;
}

export { getReport, writeReport };
