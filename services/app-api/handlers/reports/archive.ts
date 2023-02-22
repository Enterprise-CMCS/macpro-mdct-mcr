import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import { error } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";

export const archiveReport = handler(async (event, context) => {
  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  // Get current report
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

  // Delete old data prior to updating
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
