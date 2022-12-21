import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const deleteBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.bannerId!) {
    throw new Error(error.NO_KEY);
  } else {
    const params = {
      TableName: process.env.BANNER_TABLE_NAME!,
      Key: {
        key: event?.pathParameters?.bannerId!,
      },
    };
    await dynamoDb.delete(params);
    return { status: StatusCodes.SUCCESS, body: params };
  }
});
