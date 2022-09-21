import handler from "../handler-lib";
import { readReport } from "./read";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const updateReport = handler(async (event, context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  } else if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }

  const unvalidatedPayload = JSON.parse(event!.body!);

  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await readReport(reportEvent, context);
  const { fieldData: unvalidatedFieldData } = unvalidatedPayload;

  if (getCurrentReport?.body) {
    if (unvalidatedFieldData) {
      // validate report metadata
      const validatedMetadata = await validateData(
        metadataValidationSchema,
        unvalidatedPayload
      );

      // validate report field data
      const currentReport = JSON.parse(getCurrentReport.body);
      const { formTemplate } = currentReport;
      const validatedFieldData = await validateFieldData(
        formTemplate.validationJson,
        unvalidatedFieldData
      );

      const { state, id } = event.pathParameters;
      const reportParams = {
        TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
        Item: {
          ...currentReport,
          ...validatedMetadata,
          state,
          id,
          lastAltered: Date.now(),
          fieldData: {
            ...currentReport.fieldData,
            ...validatedFieldData,
          },
        },
      };
      await dynamoDb.put(reportParams);
      return {
        status: StatusCodes.SUCCESS,
        body: { ...reportParams.Item },
      };
    } else throw new Error(error.MISSING_DATA);
  } else throw new Error(error.NO_MATCHING_RECORD);
});
