import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import { error, reportTables } from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";

export const unlockReport = handler(async (event, context) => {
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

  // if current report exists, parse for locked status
  if (getCurrentReport?.body) {
    const currentReport = JSON.parse(getCurrentReport.body);
    const currentLockedStatus = currentReport?.locked;
    const reportType = currentReport?.reportType;

    const reportTable = reportTables[reportType as keyof typeof reportTables];

    // Delete raw data prior to updating
    delete currentReport.fieldData;
    delete currentReport.formTemplate;

    // toggle locked status in report metadata table
    const reportMetadataParams = {
      TableName: reportTable,
      Item: {
        ...currentReport,
        locked: !currentLockedStatus,
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
