import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";

export const deleteBanner = handler(async (event, _context) => {
  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.bannerTableName!,
    Key: {
      compoundKey: dynamoKey,
    },
  };

  await dynamoDb.delete(params);

  return params;
});
