import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const writeBanner = handler(async (event, _context) => {
  const body = JSON.parse(event!.body!);
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Item: {
      key: event?.pathParameters?.bannerId!,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event.headers["cognito-identity-id"],
      type: body.type,
      title: body.title,
      description: body.description,
      link: body.link,
      startDate: body.startDate,
      endDate: body.endDate,
    },
  };

  await dynamoDb.put(params);

  return params;
});
