import { API } from "aws-amplify";
import { ReportDetails } from "types";
import { getRequestHeaders } from "./getRequestHeaders";

async function getReportStatus(reportDetails: ReportDetails) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const { key, programName } = reportDetails;
  const response = await API.get(
    "reportStatus",
    `/reportStatus/${key}/${programName}`,
    request
  );
  return response;
}

async function writeReportStatus(
  reportDetails: ReportDetails,
  reportStatus: string
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: reportStatus,
  };
  const { key, programName } = reportDetails;
  const response = await API.post(
    "reportStatus",
    `/reportStatus/${key}/${programName}`,
    request
  );
  return response;
}

export { getReportStatus, writeReportStatus };
