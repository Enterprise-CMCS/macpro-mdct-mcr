import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const deleteReportData = handler(async (event, _context) => {
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
    const params = {
      TableName: process.env.REPORT_DATA_TABLE_NAME!,
      Key: {
        state: event?.pathParameters?.state!,
        reportId: event?.pathParameters?.reportId!,
      },
    };
    await dynamoDb.delete(params);
    return { status: StatusCodes.SUCCESS, body: params };
  }
});
