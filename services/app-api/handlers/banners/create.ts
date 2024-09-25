import * as yup from "yup";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { validateData } from "../../utils/validation/validation";
import { error } from "../../utils/constants/constants";
import {
  badRequest,
  created,
  forbidden,
  internalServerError,
} from "../../utils/responses/response-lib";
// types
import { UserRoles } from "../../utils/types";

const validationSchema = yup.object().shape({
  key: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
  link: yup.string().url().notRequired(),
  startDate: yup.number().required(),
  endDate: yup.number().required(),
});

export const createBanner = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return forbidden(error.UNAUTHORIZED);
  }
  if (!event?.pathParameters?.bannerId!) {
    return badRequest(error.NO_KEY);
  }
  const unvalidatedPayload = JSON.parse(event.body!);

  let validatedPayload;
  try {
    validatedPayload = await validateData(validationSchema, unvalidatedPayload);
  } catch {
    return badRequest(error.INVALID_DATA);
  }

  const { title, description, link, startDate, endDate } = validatedPayload;
  const currentTime = Date.now();

  const params = {
    TableName: process.env.BANNER_TABLE_NAME!,
    Item: {
      key: event.pathParameters.bannerId,
      createdAt: currentTime,
      lastAltered: currentTime,
      lastAlteredBy: event?.headers["cognito-identity-id"],
      title,
      description,
      link,
      startDate,
      endDate,
    },
  };
  try {
    await dynamoDb.put(params);
  } catch {
    return internalServerError(error.DYNAMO_CREATION_ERROR);
  }
  return created(params);
});
