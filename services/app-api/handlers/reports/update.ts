// handlers & methods
import handler from "../handler-lib";
import { readReport } from "./read";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import {
  NO_KEY_ERROR_MESSAGE,
  UNAUTHORIZED_MESSAGE,
} from "../../utils/constants/constants";

export const updateReport = handler(async (event, context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: UNAUTHORIZED_MESSAGE,
    };
  } else if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }

  const unvalidatedPayload = JSON.parse(event!.body!);

  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await readReport(reportEvent, context);
  const { fieldData: unvalidatedFieldData } = unvalidatedPayload;

  if (getCurrentReport?.body && unvalidatedFieldData) {
    // validate report metadata
    const validatedMetadata = await validateData(
      metadataValidationSchema,
      unvalidatedPayload
    );

    // validate report field data
    const currentReport = JSON.parse(getCurrentReport.body);
    const { formTemplate } = currentReport;
    const validatedFieldData = validateFieldData(
      formTemplate.validationJson,
      unvalidatedFieldData
    );

    if (validatedMetadata && validatedFieldData) {
      const { state, id } = event.pathParameters;
      const reportParams = {
        TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
        Item: {
          ...currentReport,
          ...validatedMetadata,
          state,
          id,
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
  }
});
