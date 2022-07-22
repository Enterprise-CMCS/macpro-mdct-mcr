import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (!event?.pathParameters?.reportId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  } else {
    const body = JSON.parse(event!.body!);
    const params = {
      TableName: process.env.REPORT_TABLE_NAME!,
      Item: {
        key: event.pathParameters.reportId,
        report: body.report,
      },
    };
    await dynamoDb.put(params);

    const statusParams = {
      TableName: process.env.REPORT_STATUS_TABLE_NAME!,
      Item: {
        key: event.pathParameters.reportId,
        createdAt: Date.now(),
        lastAltered: Date.now(),
        lastAlteredBy: event?.headers["cognito-identity-id"],
      },
    };
    await dynamoDb.put(statusParams);
    return { status: StatusCodes.SUCCESS, body: { params, statusParams } };
  }
});
