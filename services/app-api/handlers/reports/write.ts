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
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (
    !event?.pathParameters?.state! ||
    !event?.pathParameters?.reportId!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const body = JSON.parse(event!.body!);
  const state: string = event.pathParameters.state;
  const reportId: string = event.pathParameters.reportId;

  let statusParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
    Item: {
      state: state,
      reportId: reportId,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      ...body,
    },
  };
  const getCurrentReport = await getReport(event, context);
  if (getCurrentReport.body) {
    const currentBody = JSON.parse(getCurrentReport.body);
    if (currentBody.createdAt) {
      statusParams = {
        TableName: process.env.REPORT_TABLE_NAME!,
        Item: {
          ...statusParams.Item,
          createdAt: currentBody.createdAt,
          dueDate: currentBody?.dueDate,
        },
      };
    }
  }

  await dynamoDb.put(statusParams);
  return {
    status: StatusCodes.SUCCESS,
    body: { ...statusParams.Item },
  };
});
