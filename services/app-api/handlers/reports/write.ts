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
    !event?.pathParameters?.stateYear! ||
    !event?.pathParameters?.programName!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const body = JSON.parse(event!.body!);
  const stateYear: string = event.pathParameters.stateYear;
  const programName: string = event.pathParameters.programName;

  let reportParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
    Item: {
      key: stateYear,
      programName: programName,
      reportData: body,
    },
  };
  const getCurrentReport = await getReport(event, context);
  const currentReport = JSON.parse(getCurrentReport.body);
  if (currentReport) {
    const newReport = {
      ...currentReport.reportData,
      ...body,
    };
    reportParams = {
      TableName: process.env.REPORT_TABLE_NAME!,
      Item: {
        key: stateYear,
        programName: programName,
        reportData: { ...newReport },
      },
    };
  }
  await dynamoDb.put(reportParams);
  return {
    status: StatusCodes.SUCCESS,
    body: { ...reportParams.Item },
  };
});
