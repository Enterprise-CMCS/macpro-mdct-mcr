import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { error, reportTables } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
// types
import { StatusCodes, UserRoles } from "../../utils/types";

export const archiveReport = handler(async (event, context) => {
  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN, UserRoles.APPROVER])) {
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
  }
});
