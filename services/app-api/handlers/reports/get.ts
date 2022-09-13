import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";
import { sanitizeObject } from "../../utils/sanitizeObject";

export const getReport = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.reportId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
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

  return {
    status: StatusCodes.SUCCESS,
    body: responseBody,
  };
});

export const getReportsByState = handler(async (event, _context) => {
  if (!event?.pathParameters?.state!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": event.pathParameters.state,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };
  const reportQueryResponse = await dynamoDb.query(queryParams);

  const newReportQueryResponse: any[] = [];

  if (reportQueryResponse.Items) {
    for (let index = 0; index < reportQueryResponse.Items.length; index++) {
      const item = reportQueryResponse.Items[index];

      newReportQueryResponse.push(sanitizeObject(item));
    }

    reportQueryResponse.Items = newReportQueryResponse;
  }

  return {
    status: StatusCodes.SUCCESS,
    body: reportQueryResponse.Items,
  };
});
