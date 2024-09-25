import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
// utils
import { error } from "../../utils/constants/constants";
import { badRequest, ok } from "../../utils/responses/response-lib";

export const fetchBanner = handler(async (event, _context) => {
  if (!event?.pathParameters?.bannerId!) {
    return badRequest(error.NO_KEY);
  }
  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Key: {
      key: event.pathParameters.bannerId,
    },
  };
  const response = await dynamoDb.get(params);

  return ok(response);
});
