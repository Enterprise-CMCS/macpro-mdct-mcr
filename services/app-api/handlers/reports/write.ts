import handler from "../handler-lib";
import { getReport } from "./get";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeReport = handler(async (event, context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (!event?.pathParameters?.reportId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const body = JSON.parse(event!.body!);
  const reportId: string = event.pathParameters.reportId;

  let reportParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
    Item: {
      key: reportId,
      report: body.report,
    },
  };
  let statusParams = {
    TableName: process.env.REPORT_STATUS_TABLE_NAME!,
    Item: {
      key: reportId,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event?.headers["cognito-identity-id"],
    },
  };
  const getCurrentReport = await getReport(event, context);
  const currentBody = JSON.parse(getCurrentReport.body);
  if (currentBody.report) {
    const newReport = {
      ...currentBody.report,
      ...body.report,
    };
    reportParams = {
      TableName: process.env.REPORT_TABLE_NAME!,
      Item: {
        key: reportId,
        report: { ...newReport },
      },
    };
    statusParams = {
      TableName: process.env.REPORT_STATUS_TABLE_NAME!,
      Item: {
        key: reportId,
        createdAt: currentBody.createdAt,
        lastAltered: Date.now(),
        lastAlteredBy: event?.headers["cognito-identity-id"],
      },
    };
  }
  await dynamoDb.put(reportParams);
  await dynamoDb.put(statusParams);
  return {
    status: StatusCodes.SUCCESS,
    body: { ...reportParams.Item, ...statusParams.Item },
  };
});
