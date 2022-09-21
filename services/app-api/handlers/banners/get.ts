import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const getBanner = handler(async (event, _context) => {
  if (!event?.pathParameters?.bannerId!) {
    throw new Error(error.NO_KEY);
  }
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: event?.pathParameters?.bannerId!,
    },
  };
  const queryResponse = await dynamoDb.get(params);
  return { status: StatusCodes.SUCCESS, body: queryResponse };
});
