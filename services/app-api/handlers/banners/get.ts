import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createKey } from "../dynamoUtils/createKey";

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
  const dynamoKey = createKey(event);
  const params = {
    TableName: process.env.bannerTableName!,
    Key: {
      key: dynamoKey,
    },
  };
  const queryValue = await dynamoDb.get(params);
  return queryValue;
});
