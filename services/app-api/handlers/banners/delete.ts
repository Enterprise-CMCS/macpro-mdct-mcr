import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const deleteBanner = handler(async (_event, _context) => {
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: process.env.BANNER_ID!,
    },
  };

  await dynamoDb.delete(params);

  return params;
});
