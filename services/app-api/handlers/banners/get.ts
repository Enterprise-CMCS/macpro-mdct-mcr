import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const listBanners = handler(async (event, _context) => {
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    ...convertToDynamoExpression(
      // TODO: CHANGE
      { key: process.env.BANNER_ID! },
      "list"
    ),
  };
  const queryValue = await dynamoDb.scan(params);
  return queryValue;
});

export const getBanner = handler(async (_event, _context) => {
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: process.env.BANNER_ID!,
    },
  };
  const queryValue = await dynamoDb.get(params);
  return queryValue;
});
