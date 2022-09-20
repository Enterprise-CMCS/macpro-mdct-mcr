import * as yup from "yup";
import KSUID from "ksuid";
// handlers & methods
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  filterValidationSchema,
  mapValidationTypesToSchema,
  validateData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

export const createReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (!event?.pathParameters?.state!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const unvalidatedPayload = JSON.parse(event!.body!);

  const { fieldData: unvalidatedFieldData, formTemplate } = unvalidatedPayload;
  // filter field validation to just what's needed for the passed fields
  const filteredFieldDataValidationJson = filterValidationSchema(
    formTemplate.validationJson,
    unvalidatedFieldData
  );
  // transform field validation instructions to yup validation schema
  const fieldDataValidationSchema = yup
    .object()
    .shape(mapValidationTypesToSchema(filteredFieldDataValidationJson));

  const validatedFieldData = await validateData(
    fieldDataValidationSchema,
    unvalidatedFieldData
  );

  const validatedMetadata = await validateData(
    metadataValidationSchema,
    unvalidatedPayload
  );

  if (validatedFieldData && validatedMetadata) {
    const state: string = event.pathParameters.state;
    const id: string = KSUID.randomSync().string;
    let reportParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...validatedMetadata,
        state: state,
        id: id,
        createdAt: Date.now(),
        lastAltered: Date.now(),
        fieldData: validatedFieldData,
      },
    };
    await dynamoDb.put(reportParams);
    return {
      status: StatusCodes.SUCCESS,
      body: { ...reportParams.Item },
    };
  }
});
