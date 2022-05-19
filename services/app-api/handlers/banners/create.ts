import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const createBanner = handler(async (event, _context) => {
  const body = JSON.parse(event!.body!);
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Item: {
      key: process.env.BANNER_ID!,
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
