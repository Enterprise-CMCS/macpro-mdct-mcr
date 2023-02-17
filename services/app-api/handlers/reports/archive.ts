import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { error } from "../../utils/constants/constants";

export const archiveReport = handler(async (event, context) => {
  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  if (!getCurrentReport.body) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const currentReport = JSON.parse(getCurrentReport.body);
  const currentArchivedStatus = currentReport?.archived;

  // Delete raw data prior to updating
  delete currentReport.fieldData;
  delete currentReport.formTemplate;

  // Toggle archived state in DynamoDB.
  const reportMetadataParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Item: {
      ...currentReport,
      archived: !currentArchivedStatus,
    },
  };

  try {
    await dynamoDb.put(reportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: reportMetadataParams.Item,
  };
});
