import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";

export const createBanner = handler(async (event, _context) => {
  const body = JSON.parse(event!.body!);
  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.bannerTableName!,
    Item: {
      compoundKey: dynamoKey,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event.headers["cognito-identity-id"],
      data: body.data,
    },
  };

  await dynamoDb.put(params);

  return params;
});
