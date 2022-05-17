import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const listBanners = handler(async (event, _context) => {
  const params = {
    TableName: process.env.bannerTableName!,
    ...convertToDynamoExpression(
      // TODO: CHANGE
      {},
      "list"
    ),
  };
  const queryValue = await dynamoDb.scan(params);
  return queryValue;
});

export const getBanner = handler(async (event, _context) => {
  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.bannerTableName!,
    Key: {
      compoundKey: dynamoKey,
    },
  };
  const queryValue = await dynamoDb.get(params);
  return queryValue;
});
