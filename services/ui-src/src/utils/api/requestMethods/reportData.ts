import { API } from "aws-amplify";
import { FieldDataShape, ReportDetails } from "types";
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
  fieldData: FieldDataShape
) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: fieldData,
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
