import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { error, reportTables } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
// types
import { UserRoles } from "../../utils/types";

export const archiveReport = handler(async (event, context) => {
  const requiredParams = ["reportType", "state", "id"];
  // Return bad request if missing required parameters
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters, requiredParams)
  ) {
    return badRequest(error.NO_KEY);
  }
  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN, UserRoles.APPROVER])) {
    return forbidden(error.UNAUTHORIZED);
  }

  // Get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  if (!getCurrentReport?.body) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  // parse for archived status
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

  try {
    await dynamoDb.put(reportMetadataParams);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  return ok(reportMetadataParams.Item);
});
