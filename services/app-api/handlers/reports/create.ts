import KSUID from "ksuid";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import s3Lib from "../../utils/s3/s3-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import { S3Put, StatusCodes, UserRoles } from "../../utils/types/types";
import {
  error,
  buckets,
  reportTables,
  reportBuckets,
} from "../../utils/constants/constants";

export const createReport = handler(async (event, _context) => {
  let status, body;
  const requiredParams = ["reportType", "state"];
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    status = StatusCodes.UNAUTHORIZED;
    body = error.UNAUTHORIZED;
  } else if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    throw new Error(error.NO_KEY);
  } else {
    const state: string = event.pathParameters?.state!;
    const unvalidatedPayload = JSON.parse(event!.body!);
    const {
      metadata: unvalidatedMetadata,
      fieldData: unvalidatedFieldData,
      formTemplate,
    } = unvalidatedPayload;
    const reportType = unvalidatedPayload.metadata.reportType;
    const fieldDataValidationJson = formTemplate.validationJson;

    const reportBucket =
      reportBuckets[reportType as keyof typeof reportBuckets];
    const reportTable = reportTables[reportType as keyof typeof reportTables];

    // if field data and validation json have been passed
    if (unvalidatedFieldData && fieldDataValidationJson) {
      const reportId: string = KSUID.randomSync().string;
      const fieldDataId: string = KSUID.randomSync().string;
      const formTemplateId: string = KSUID.randomSync().string;

      // validate field data
      const validatedFieldData = await validateFieldData(
        fieldDataValidationJson,
        unvalidatedFieldData
      );

      // if field data passes validation,
      if (validatedFieldData) {
        // post validated field data to s3 bucket
        const fieldDataParams: S3Put = {
          Bucket: reportBucket,
          Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
          Body: JSON.stringify(validatedFieldData),
          ContentType: "application/json",
        };
        await s3Lib.put(fieldDataParams);
        // post form template to s3 bucket
        const formTemplateParams: S3Put = {
          Bucket: reportBucket,
          Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
          Body: JSON.stringify(formTemplate),
          ContentType: "application/json",
        };
        await s3Lib.put(formTemplateParams);

        // validate report metadata
        const validatedMetadata = await validateData(metadataValidationSchema, {
          ...unvalidatedMetadata,
        });
        // if metadata passes validation,
        if (validatedMetadata) {
          // create record in report metadata table
          let reportMetadataParams = {
            TableName: reportTable,
            Item: {
              ...validatedMetadata,
              state,
              id: reportId,
              fieldDataId,
              formTemplateId,
              createdAt: Date.now(),
              lastAltered: Date.now(),
            },
          };

          await dynamoDb.put(reportMetadataParams);

          // set response status and body
          status = StatusCodes.CREATED;
          body = { ...reportMetadataParams.Item };
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
  }
  return { status, body };
});
