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
      report: body.report,
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
        key: stateYear,
        programName: programName,
        report: { ...newReport },
      },
    };
  }
  await dynamoDb.put(reportParams);
  return {
    status: StatusCodes.SUCCESS,
    body: { ...reportParams.Item },
  };
});
