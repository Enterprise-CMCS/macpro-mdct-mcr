import * as yup from "yup";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { validateData } from "../../utils/validation/validation";
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
    const unvalidatedPayload = JSON.parse(event!.body!);

    const validationSchema = yup.object().shape({
      key: yup.string().required(),
      title: yup.string().required(),
      description: yup.string().required(),
      url: yup.string().url().notRequired(),
      startDate: yup.number().required(),
      endDate: yup.number().required(),
    });

    const validatedPayload = await validateData(
      validationSchema,
      unvalidatedPayload
    );

    if (validatedPayload) {
      const params = {
        TableName: process.env.BANNER_TABLE_NAME!,
        Item: {
          key: event.pathParameters.bannerId,
          createdAt: Date.now(),
          lastAltered: Date.now(),
          lastAlteredBy: event?.headers["cognito-identity-id"],
          title: unvalidatedPayload.title,
          description: unvalidatedPayload.description,
          link: unvalidatedPayload.link,
          startDate: unvalidatedPayload.startDate,
          endDate: unvalidatedPayload.endDate,
        },
      };
      await dynamoDb.put(params);
      return { status: StatusCodes.SUCCESS, body: params };
    }
    // fallback failure response
    return { status: StatusCodes.FAILURE, body: {} };
  }
});
