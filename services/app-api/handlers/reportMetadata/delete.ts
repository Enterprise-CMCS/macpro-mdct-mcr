import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const deleteReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (
    !event?.pathParameters?.state! ||
    !event?.pathParameters?.reportId!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  } else {
    const paramKeys = {
      Key: {
        state: event?.pathParameters?.state!,
        reportId: event?.pathParameters?.reportId!,
      },
    };
    // delete report from report metadata table
    const deleteReportParams = {
      TableName: process.env.REPORT_METADATA_TABLE_NAME!,
      ...paramKeys,
    };
    await dynamoDb.delete(deleteReportParams);

    // delete report data from report data table
    const deleteReportDataParams = {
      TableName: process.env.REPORT_DATA_TABLE_NAME!,
      ...paramKeys,
    };
    await dynamoDb.delete(deleteReportDataParams);

    return {
      status: StatusCodes.SUCCESS,
      body: { deleteReportParams, deleteReportDataParams },
    };
  }
});
