import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { createKey } from "../dynamoUtils/createKey";

export const deleteBanner = handler(async (event, _context) => {
  const dynamoKey = createKey(event);
  const params = {
    TableName: process.env.bannerTableName!,
    Key: {
      key: dynamoKey,
    },
  };

  await dynamoDb.delete(params);

  return params;
});
