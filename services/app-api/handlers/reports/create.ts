import KSUID from "ksuid";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const createReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.state!) {
    throw new Error(error.NO_KEY);
  }

  const unvalidatedPayload = JSON.parse(event!.body!);
  const { fieldData: unvalidatedFieldData, formTemplate } = unvalidatedPayload;
  const fieldDataValidationJson = formTemplate.validationJson;
  if (unvalidatedFieldData && fieldDataValidationJson) {
    // validate report metadata
    const validatedMetadata = await validateData(
      metadataValidationSchema,
      unvalidatedPayload
    );

    // validate report field data
    const validatedFieldData = await validateFieldData(
      fieldDataValidationJson,
      unvalidatedFieldData
    );

    const state: string = event.pathParameters.state;
    const id: string = KSUID.randomSync().string;
    let reportParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...validatedMetadata,
        state,
        id,
        createdAt: Date.now(),
        lastAltered: Date.now(),
        fieldData: validatedFieldData,
      },
    };
    await dynamoDb.put(reportParams);
    return {
      status: StatusCodes.CREATED,
      body: { ...reportParams.Item },
    };
  } else throw new Error(error.MISSING_DATA);
});
