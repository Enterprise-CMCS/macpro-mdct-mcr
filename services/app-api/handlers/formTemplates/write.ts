import * as yup from "yup";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import { validateData } from "../../utils/validation/validation";
import {
  MISSING_DATA_ERROR_MESSAGE,
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";
import { StatusCodes, UserRoles } from "../../utils/types/types";

export const writeFormTemplate = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  }
  const unvalidatedPayload = JSON.parse(event!.body!);
  if (!unvalidatedPayload?.formTemplateId) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  } else if (!unvalidatedPayload?.formTemplate) {
    throw new Error(MISSING_DATA_ERROR_MESSAGE);
  } else {
    const validationSchema = yup.object().shape({
      formTemplateId: yup.string().required(),
      formTemplateVersion: yup.string().required(),
      formTemplate: yup
        .object()
        .required()
        .shape({
          name: yup.string().required(),
          basePath: yup.string().required(),
          version: yup.string().required(),
          routes: yup.array().of(yup.object()).required(),
          validationSchema: yup.object().required(),
        }),
    });

    const validatedPayload = await validateData(
      validationSchema,
      unvalidatedPayload
    );

    if (validatedPayload) {
      const params = {
        TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
        Item: {
          formTemplateId: validatedPayload.formTemplateId,
          createdAt: Date.now(),
          lastAltered: Date.now(),
          lastAlteredBy: event?.headers["cognito-identity-id"],
          formTemplate: validatedPayload.formTemplate,
          ...validatedPayload,
        },
      };
      await dynamoDb.put(params);
      return { status: StatusCodes.SUCCESS, body: params };
    }
  }
});
