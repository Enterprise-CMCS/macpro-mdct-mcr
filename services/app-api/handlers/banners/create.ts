import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { createKey } from "../dynamoUtils/createKey";

export const createBanner = handler(async (event, _context) => {
  const body = JSON.parse(event!.body!);
  const dynamoKey = createKey(event);
  const params = {
    TableName: process.env.bannerTableName!,
    Item: {
      key: dynamoKey,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event.headers["cognito-identity-id"],
      type: body.type,
      title: body.title,
      description: body.description,
    },
  };

  await dynamoDb.put(params);

  return params;
});
