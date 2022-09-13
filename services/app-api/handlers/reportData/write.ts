import handler from "../handler-lib";
import { getReportData } from "./get";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeReportData = handler(async (event, context) => {
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

  let reportParams = {
    TableName: process.env.REPORT_DATA_TABLE_NAME!,
    Item: {
      state: state,
      reportId: reportId,
      fieldData: body,
    },
  };
  const getCurrentReport = await getReportData(event, context);
  if (getCurrentReport.body) {
    const currentBody = JSON.parse(getCurrentReport.body);
    if (currentBody) {
      const newReport = {
        ...currentBody.fieldData,
        ...body,
      };

      reportParams = {
        TableName: process.env.REPORT_DATA_TABLE_NAME!,
        Item: {
          state: state,
          reportId: reportId,
          fieldData: { ...newReport },
        },
      };
    }
  }
  await dynamoDb.put(reportParams);
  return {
    status: StatusCodes.SUCCESS,
    body: { ...reportParams.Item },
  };
});
