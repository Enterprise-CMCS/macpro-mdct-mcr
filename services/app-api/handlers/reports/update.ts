import handler from "../handler-lib";
import { fetchReport } from "./fetch";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import {
  archiveValidationSchema,
  metadataValidationSchema,
} from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const updateReport = handler(async (event, context) => {
  let status, body;
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  } else if (
    !hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])
  ) {
    // if they have admin permissions, attempt the archive function
    if (hasPermissions(event, [UserRoles.ADMIN])) {
      const { statusCode: archiveStatus, body: archiveBody } =
        await archiveReport(event, context);
      status = archiveStatus;
      body = JSON.parse(archiveBody);
    } else {
      status = StatusCodes.UNAUTHORIZED;
      body = error.UNAUTHORIZED;
    }
  } else {
    const unvalidatedPayload = JSON.parse(event!.body!);

    // get current report
    const reportEvent = { ...event, body: "" };
    const getCurrentReport = await fetchReport(reportEvent, context);
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

        const reportParams = {
          TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
          Item: {
            ...currentReport,
            ...validatedMetadata,
            lastAltered: Date.now(),
            fieldData: {
              ...currentReport.fieldData,
              ...validatedFieldData,
            },
          },
        };
        await dynamoDb.put(reportParams);
        status = StatusCodes.SUCCESS;
        body = reportParams.Item;
      } else {
        status = StatusCodes.BAD_REQUEST;
        body = error.MISSING_DATA;
      }
    } else {
      status = StatusCodes.NOT_FOUND;
      body = error.NO_MATCHING_RECORD;
    }
  }

  return {
    status: status,
    body: body,
  };
});

export const archiveReport = handler(async (event, context) => {
  let status, body;
  const unvalidatedPayload = JSON.parse(event!.body!);

  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  if (getCurrentReport?.body) {
    if (unvalidatedPayload?.archived) {
      const validatedArchiveValue = await validateData(
        archiveValidationSchema,
        unvalidatedPayload
      );
      const currentReport = JSON.parse(getCurrentReport.body);
      const reportParams = {
        TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
        Item: {
          ...currentReport,
          lastAltered: Date.now(),
          fieldData: {
            ...currentReport.fieldData,
          },
          archived: validatedArchiveValue.archived,
        },
      };
      await dynamoDb.put(reportParams);
      status = StatusCodes.SUCCESS;
      body = reportParams.Item;
    } else {
      status = StatusCodes.BAD_REQUEST;
      body = error.MISSING_DATA;
    }
  } else {
    status = StatusCodes.NOT_FOUND;
    body = error.NO_MATCHING_RECORD;
  }

  return {
    status: status,
    body: body,
  };
});
