import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";
import { Key } from "aws-sdk/clients/dynamodb";

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

export const getLatestForm = handler(async (_event, _context) => {
  const queryParams = {
    TableName: process.env.FORM_TABLE_NAME!,
    ExclusiveStartKey: undefined as Key | undefined,
  };

  const scannedResults: any[] = [];
  let queryValue;

  do {
    queryValue = await dynamoDb.scan(queryParams);
    if (queryValue?.Items) {
      scannedResults.push(...queryValue.Items);
    }
    queryParams.ExclusiveStartKey = queryValue.LastEvaluatedKey;
  } while (queryValue.LastEvaluatedKey !== undefined);

  const latestFormTimestamp = Math.max(
    ...scannedResults.map((item) => parseInt(item.createdAt))
  );

  const latestForm = scannedResults.filter(
    (item) => parseInt(item.createdAt) === latestFormTimestamp
  );

  return {
    status: StatusCodes.SUCCESS,
    body: latestForm[0],
  };
});
