import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";
import { sanitizeObject } from "../../utils/sanitizeObject";

export const getReportData = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.reportId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.REPORT_DATA_TABLE_NAME!,
    KeyConditionExpression: "#state = :state AND #reportId = :reportId",
    ExpressionAttributeValues: {
      ":state": event.pathParameters.state,
      ":reportId": event.pathParameters.reportId,
    },
    ExpressionAttributeNames: {
      "#state": "state",
      "#reportId": "reportId",
    },
  };
  const reportQueryResponse = await dynamoDb.query(queryParams);

  const responseBody = reportQueryResponse.Items![0] ?? {};

  responseBody.fieldData = sanitizeObject(responseBody.fieldData);

  return {
    status: StatusCodes.SUCCESS,
    body: responseBody,
  };
});
