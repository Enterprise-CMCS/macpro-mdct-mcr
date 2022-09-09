import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";
import { sanitize } from "../../utils/sanitize";

export const getBanner = handler(async (event, _context) => {
  if (!event?.pathParameters?.bannerId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: event?.pathParameters?.bannerId!,
    },
  };
  const queryResponse: any = await dynamoDb.get(params);

  queryResponse.Item.title = sanitize(queryResponse.Item.title);
  queryResponse.Item.description = sanitize(queryResponse.Item.description);
  queryResponse.Item.link = sanitize(queryResponse.Item.link);

  return { status: StatusCodes.SUCCESS, body: queryResponse };
});
