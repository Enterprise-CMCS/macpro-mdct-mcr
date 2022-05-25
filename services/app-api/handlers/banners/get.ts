import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";

export const getBanner = handler(async (event, _context) => {
  console.log("in getBanner handler"); // eslint-disable-line
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: event?.pathParameters?.bannerId!,
    },
  };
  console.log("getBanner params:", params); // eslint-disable-line
  const queryResponse = await dynamoDb.get(params);
  console.log("query response from dynamodb get", queryResponse); // eslint-disable-line
  return { status: StatusCodes.SUCCESS, body: queryResponse };
});
