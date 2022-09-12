import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

export const getFormTemplate = handler(async (event, _context) => {
  if (!event?.pathParameters?.formTemplateId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    KeyConditionExpression: "#formTemplateId = :formTemplateId",
    ExpressionAttributeValues: {
      ":formTemplateId": event.pathParameters.formTemplateId,
    },
    ExpressionAttributeNames: {
      "#formTemplateId": "formTemplateId",
    },
  };
  const queryResponse = await dynamoDb.query(queryParams);
  const responseBody = queryResponse.Items![0] ?? {};
  return {
    status: StatusCodes.SUCCESS,
    body: responseBody,
  };
});
