import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";

export const listMeasures = handler(async (event, context) => {
  const state = event.pathParameters?.state;
  const year = event.pathParameters?.year as string;
  const coreSet = event.pathParameters?.coreSet;

  const params = {
    TableName: process.env.measureTableName!,
    ...convertToDynamoExpression(
      { state: state, year: parseInt(year), coreSet: coreSet },
      "list"
    ),
  };
  const queryValue = await dynamoDb.scan(params);
  return queryValue;
});

export const getMeasure = handler(async (event, context) => {
  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.measureTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: event.pathParameters!.coreSet!,
    },
  };
  const queryValue = await dynamoDb.get(params);
  return queryValue;
});
