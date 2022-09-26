import * as yup from "yup";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { validateData } from "../../utils/validation/validation";
import error from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const createBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.bannerId!) {
    throw new Error(error.NO_KEY);
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
          title: validatedPayload.title,
          description: validatedPayload.description,
          link: validatedPayload.link,
          startDate: validatedPayload.startDate,
          endDate: validatedPayload.endDate,
        },
      };
      await dynamoDb.put(params);
      return { status: StatusCodes.SUCCESS, body: params };
    }
  }
});
