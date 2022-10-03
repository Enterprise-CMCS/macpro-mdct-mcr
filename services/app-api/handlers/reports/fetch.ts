import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const fetchReport = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const params = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Key: {
      state: event.pathParameters.state,
      id: event.pathParameters.id,
    },
  };
  const response = await dynamoDb.get(params);

  let status = StatusCodes.SUCCESS;
  if (!response?.Item) {
    status = StatusCodes.NOT_FOUND;
  }
  return {
    status: status,
    body: response.Item,
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
