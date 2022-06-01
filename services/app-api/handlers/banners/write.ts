import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { UNAUTHORIZED_MESSAGE } from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeBanner = handler(async (event, _context) => {
  if (hasPermissions(event, [UserRoles.ADMIN])) {
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
    return { status: StatusCodes.SUCCESS, body: params };
  } else {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  }
});
