import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

export const getForm = handler(async (event, _context) => {
  if (!event?.pathParameters?.formName! || !event?.pathParameters?.formId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.FORM_TABLE_NAME!,
    KeyConditionExpression: "#formName = :formName AND #formId = :formId",
    ExpressionAttributeValues: {
      ":formName": event.pathParameters.formName,
      ":formId": event.pathParameters.formId,
    },
    ExpressionAttributeNames: {
      "#formName": "formName",
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
