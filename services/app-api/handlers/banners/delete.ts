import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import { badRequest, forbidden, ok } from "../../utils/responses/response-lib";
// types
import { UserRoles } from "../../utils/types";

export const deleteBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return forbidden(error.UNAUTHORIZED);
  }
  if (!event?.pathParameters?.bannerId!) {
    return badRequest(error.NO_KEY);
  }
  const params = {
    TableName: process.env.BannerTable!,
    Key: {
      key: event.pathParameters.bannerId,
    },
  };
  await dynamoDb.delete(params);
  return ok();
});
