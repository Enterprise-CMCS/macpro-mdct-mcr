import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const fetchReport = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const queryParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    KeyConditionExpression: "#state = :state AND #id = :id",
    ExpressionAttributeValues: {
      ":state": event.pathParameters.state,
      ":id": event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      "#state": "state",
      "#id": "id",
    },
  };
  const reportQueryResponse = await dynamoDb.query(queryParams);
  const responseBody = reportQueryResponse.Items![0] ?? {};
  return {
    status: StatusCodes.SUCCESS,
    body: responseBody,
  };
});

export const fetchReportsByState = handler(async (event, _context) => {
  if (!event?.pathParameters?.state!) {
    throw new Error(error.NO_KEY);
  }
  const queryParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": event.pathParameters.state,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };
  const reportQueryResponse = await dynamoDb.query(queryParams);
  return {
    status: StatusCodes.SUCCESS,
    body: reportQueryResponse.Items,
  };
});
