import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import s3Lib from "../../utils/s3/s3-lib";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
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
    // get current report (so we can get the fieldDataId and formTemplateId)
    const reportEvent = { ...event, body: "" };
    const getCurrentReport = await fetchReport(reportEvent, context);
    if (getCurrentReport?.body) {
      const currentReport = JSON.parse(getCurrentReport.body);
      const { formTemplateId, fieldDataId } = currentReport;

      // check if report is archived (if not, we can proceed with updates)
      const isArchived = currentReport.archived;
      if (!isArchived) {
        const state: string = event.pathParameters.state;

        // get formTemplate from s3 bucket for fieldData validation
        const formTemplateParams = {
          Bucket: process.env.MCPAR_FORM_BUCKET!,
          Key: "formTemplates/" + state + "/" + formTemplateId,
        };
        const formTemplate: any = await s3Lib.get(formTemplateParams);

        // get existing fieldData from s3 bucket for update
        const fieldDataParams = {
          Bucket: process.env.MCPAR_FORM_BUCKET!,
          Key: "fieldDatas/" + state + "/" + fieldDataId,
        };
        const existingFieldData: any = await s3Lib.get(fieldDataParams);

        // parse the passed payload
        const unvalidatedPayload = JSON.parse(event!.body!);
        const {
          metadata: unvalidatedMetadata,
          fieldData: unvalidatedFieldData,
        } = unvalidatedPayload;

        // validate passed field data
        if (unvalidatedFieldData) {
          const validatedFieldData = await validateFieldData(
            formTemplate?.validationJson,
            unvalidatedFieldData
          );

          // post fieldData to S3 bucket
          if (validatedFieldData) {
            const fieldData = {
              ...existingFieldData,
              ...validatedFieldData,
            };
            const fieldDataParams = {
              Bucket: process.env.MCPAR_FORM_BUCKET!,
              Key: "fieldData/" + state + "/" + fieldDataId,
              Body: JSON.stringify(fieldData),
              ContentType: "application/json",
            };
            await s3Lib.put(fieldDataParams);
          } else {
            status = StatusCodes.BAD_REQUEST;
            body = error.INVALID_DATA;
          }

          // validate report metadata
          const validatedMetadata = await validateData(
            metadataValidationSchema,
            { ...unvalidatedMetadata }
          );
          // update report metadata
          if (validatedMetadata) {
            const reportParams = {
              TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
              Item: {
                ...currentReport,
                ...validatedMetadata,
                lastAltered: Date.now(),
              },
            };
            await dynamoDb.put(reportParams);

            // set response status and body
            status = StatusCodes.SUCCESS;
            body = reportParams.Item;
          } else {
            status = StatusCodes.BAD_REQUEST;
            body = error.INVALID_DATA;
          }
        } else {
          status = StatusCodes.BAD_REQUEST;
          body = error.MISSING_DATA;
        }
      } else {
        status = StatusCodes.UNAUTHORIZED;
        body = error.UNAUTHORIZED;
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
  // get current report
  const reportEvent = { ...event, body: "" };
  const getCurrentReport = await fetchReport(reportEvent, context);

  if (getCurrentReport?.body) {
    const currentReport = JSON.parse(getCurrentReport.body);
    const currentArchivedStatus = currentReport?.archived;
    const reportParams = {
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
      Item: {
        ...currentReport,
        archived: !currentArchivedStatus,
      },
    };
    await dynamoDb.put(reportParams);
    status = StatusCodes.SUCCESS;
    body = reportParams.Item;
  } else {
    status = StatusCodes.NOT_FOUND;
    body = error.NO_MATCHING_RECORD;
  }
  return {
    status: status,
    body: body,
  };
});
