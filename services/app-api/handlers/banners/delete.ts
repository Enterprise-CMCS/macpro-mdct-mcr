import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";

export const deleteBanner = handler(async (event, _context) => {
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: event?.pathParameters?.bannerId!,
    },
  };

  await dynamoDb.delete(params);

  return params;
});
