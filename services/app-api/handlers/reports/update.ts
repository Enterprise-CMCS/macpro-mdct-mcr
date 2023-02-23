import handler from "../handler-lib";
import { archiveReport } from "./archive";
import { fetchReport } from "./fetch";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import { hasPermissions } from "../../utils/auth/authorization";
import s3Lib from "../../utils/s3/s3-lib";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import {
  error,
  buckets,
  reportTables,
  reportBuckets,
} from "../../utils/constants/constants";

export const updateReport = handler(async (event, context) => {
  let status, body;
  const requiredParams = ["reportType", "id", "state"];
  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
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
    // get current report
    const reportEvent = { ...event, body: "" };
    const getCurrentReport = await fetchReport(reportEvent, context);

    // if current report exists, get formTemplateId and fieldDataId
    if (getCurrentReport?.body) {
      const currentReport = JSON.parse(getCurrentReport.body);
      const { formTemplateId, fieldDataId, reportType } = currentReport;
      if (formTemplateId && fieldDataId) {
        // if report not in archived state, proceed with updates
        if (!currentReport.archived) {
          const state: string = event.pathParameters?.state!;

          const reportBucket =
            reportBuckets[reportType as keyof typeof reportBuckets];
          const reportTable =
            reportTables[reportType as keyof typeof reportTables];

          // get formTemplate from s3 bucket (for passed fieldData validation)
          const formTemplateParams = {
            Bucket: reportBucket,
            Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
          };
          const formTemplate: any = await s3Lib.get(formTemplateParams); // TODO: strict typing

          // get existing fieldData from s3 bucket (for patching with passed data)
          const fieldDataParams = {
            Bucket: reportBucket,
            Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
          };
          const existingFieldData: any = await s3Lib.get(fieldDataParams); // TODO: strict typing

          // parse the passed payload
          const unvalidatedPayload = JSON.parse(event!.body!);
          const {
            metadata: unvalidatedMetadata,
            fieldData: unvalidatedFieldData,
          } = unvalidatedPayload;

          if (unvalidatedFieldData) {
            // validate passed field data
            const validatedFieldData = await validateFieldData(
              formTemplate?.validationJson,
              unvalidatedFieldData
            );

            // if field data passes validation,
            if (validatedFieldData) {
              // post validated field data to s3 bucket
              const fieldData = {
                ...existingFieldData,
                ...validatedFieldData,
              };
              const fieldDataParams = {
                Bucket: reportBucket,
                Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
                Body: JSON.stringify(fieldData),
                ContentType: "application/json",
              };
              await s3Lib.put(fieldDataParams);

              // validate report metadata
              const validatedMetadata = await validateData(
                metadataValidationSchema,
                { ...unvalidatedMetadata }
              );
              // if metadata passes validation,
              if (validatedMetadata) {
                //Delete raw data prior to updating
                delete currentReport.fieldData;
                delete currentReport.formTemplate;

                // update record in report metadata table
                const reportMetadataParams = {
                  TableName: reportTable,
                  Item: {
                    ...currentReport,
                    ...validatedMetadata,
                    lastAltered: Date.now(),
                  },
                };
                await dynamoDb.put(reportMetadataParams);

                // set response status and body
                status = StatusCodes.SUCCESS;
                body = {
                  ...reportMetadataParams.Item,
                  fieldData,
                  formTemplate,
                };
              } else {
                status = StatusCodes.BAD_REQUEST;
                body = error.INVALID_DATA;
              }
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
        status = StatusCodes.BAD_REQUEST;
        body = error.MISSING_DATA;
      }
    } else {
      status = StatusCodes.NOT_FOUND;
      body = error.NO_MATCHING_RECORD;
    }

    return { status: status, body: body };
  }

  // If request body is missing, return a 400 error.
  if (!event?.body) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }
});
