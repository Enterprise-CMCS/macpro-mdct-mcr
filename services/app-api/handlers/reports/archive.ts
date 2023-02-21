import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { error, reportTables } from "../../utils/constants/constants";

export const archiveReport = handler(async (event, context) => {
  let status, body;
  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  // if current report exists, parse for archived status
  if (getCurrentReport?.body) {
    const currentReport = JSON.parse(getCurrentReport.body);
    const currentArchivedStatus = currentReport?.archived;
    const reportType = currentReport?.reportType;

    const reportTable = reportTables[reportType as keyof typeof reportTables];

    // Delete raw data prior to updating
    delete currentReport.fieldData;
    delete currentReport.formTemplate;

    // toggle archived status in report metadata table
    const reportMetadataParams = {
      TableName: reportTable,
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
