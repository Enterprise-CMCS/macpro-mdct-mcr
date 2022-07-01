import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (!event?.pathParameters?.bannerId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  } else {
    const body = JSON.parse(event!.body!);
    const params = {
      TableName: process.env.BANNER_TABLE_NAME!,
      Item: {
        key: event.pathParameters.bannerId,
        createdAt: Date.now(),
        lastAltered: Date.now(),
        lastAlteredBy: event?.headers["cognito-identity-id"],
        type: body.type,
        titleText: body.titleText,
        description: body.description,
        link: body.link,
        startDate: body.startDate,
        endDate: body.endDate,
      },
    };
    await dynamoDb.put(params);
    return { status: StatusCodes.SUCCESS, body: params };
  }
});
