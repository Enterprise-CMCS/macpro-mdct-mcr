import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
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
  const body = JSON.parse(event!.body!);
  if (!body?.formTemplateId) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  } else if (!body?.formTemplate) {
    throw new Error(MISSING_DATA_ERROR_MESSAGE);
  } else {
    const params = {
      TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
      Item: {
        formTemplateId: body.formTemplateId,
        createdAt: Date.now(),
        lastAltered: Date.now(),
        lastAlteredBy: event?.headers["cognito-identity-id"],
        formTemplate: body.formTemplate,
        ...body,
      },
    };
    await dynamoDb.put(params);
    return { status: StatusCodes.SUCCESS, body: params };
  }
});
