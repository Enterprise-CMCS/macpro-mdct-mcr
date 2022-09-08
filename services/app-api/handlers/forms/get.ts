import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

export const getForm = handler(async (event, _context) => {
  if (!event?.pathParameters?.formId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.FORM_TABLE_NAME!,
    KeyConditionExpression: "#formId = :formId",
    ExpressionAttributeValues: {
      ":formId": event.pathParameters.formId,
    },
    ExpressionAttributeNames: {
      "#formId": "formId",
    },
  };
  const queryResponse = await dynamoDb.query(queryParams);
  const responseBody = queryResponse.Items![0] ?? {};
  return {
    status: StatusCodes.SUCCESS,
    body: responseBody,
  };
});
