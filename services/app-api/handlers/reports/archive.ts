import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const archiveReport = handler(async (event, context) => {
  let status, body;
  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  // if current report exists, parse for archived status
  if (getCurrentReport?.body) {
    const currentReport = JSON.parse(getCurrentReport.body);
    const currentArchivedStatus = currentReport?.archived;

    // toggle archived status in report metadata table
    const reportMetadataParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...currentReport,
        archived: !currentArchivedStatus,
      },
    };
    await dynamoDb.put(reportMetadataParams);

    // set response status and body
    status = StatusCodes.SUCCESS;
    body = reportMetadataParams.Item;
  } else {
    status = StatusCodes.NOT_FOUND;
    body = error.NO_MATCHING_RECORD;
  }
  return { status, body };
});
