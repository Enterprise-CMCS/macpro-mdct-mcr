import handler from "../handler-lib";
import { getReportStatus } from "./get";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeReportStatus = handler(async (event, context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (
    !event?.pathParameters?.stateYear! ||
    !event?.pathParameters?.programName!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const body = JSON.parse(event!.body!);
  const stateYear: string = event.pathParameters.stateYear;
  const programName: string = event.pathParameters.programName;

  let statusParams = {
    TableName: process.env.REPORT_STATUS_TABLE_NAME!,
    Item: {
      key: stateYear,
      programName: programName,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event?.headers["cognito-identity-id"],
      status: body.status,
    },
  };
  const getCurrentReport = await getReportStatus(event, context);
  const currentBody = JSON.parse(getCurrentReport.body);
  if (currentBody.createdAt) {
    statusParams = {
      TableName: process.env.REPORT_STATUS_TABLE_NAME!,
      Item: {
        key: stateYear,
        programName: programName,
        createdAt: currentBody.createdAt,
        lastAltered: Date.now(),
        lastAlteredBy: event?.headers["cognito-identity-id"],
        status: body.status,
      },
    };
  }
  await dynamoDb.put(statusParams);
  return {
    status: StatusCodes.SUCCESS,
    body: { ...statusParams.Item },
  };
});
