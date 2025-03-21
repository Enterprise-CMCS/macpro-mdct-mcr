import * as yup from "yup";
import handler from "../handler-lib";
import { randomUUID } from "crypto";
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
      key: randomUUID(),
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
