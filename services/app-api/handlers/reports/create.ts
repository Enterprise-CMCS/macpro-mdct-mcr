import KSUID from "ksuid";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import s3Lib from "../../utils/s3/s3-lib";
import {
  hasReportAccess,
  hasPermissions,
} from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import {
  error,
  buckets,
  reportTables,
  reportBuckets,
} from "../../utils/constants/constants";
// types
import { S3Put, StatusCodes, UserRoles } from "../../utils/types";

export const createReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const requiredParams = ["reportType", "state"];

  // Return error if no state is passed.
  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const state: string = event.pathParameters?.state!;
  const unvalidatedPayload = JSON.parse(event!.body!);
  const {
    metadata: unvalidatedMetadata,
    fieldData: unvalidatedFieldData,
    formTemplate,
  } = unvalidatedPayload;
  const reportType = unvalidatedPayload.metadata.reportType;
  const fieldDataValidationJson = formTemplate.validationJson;

  // Return a 403 status if the user does not have access to this report
  if (!hasReportAccess(event, reportType)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];
  const reportTable = reportTables[reportType as keyof typeof reportTables];

  // Return MISSING_DATA error if missing unvalidated data or validators.
  if (!unvalidatedFieldData || !fieldDataValidationJson) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  // Create report and field ids.
  const reportId: string = KSUID.randomSync().string;
  const fieldDataId: string = KSUID.randomSync().string;
  const formTemplateId: string = KSUID.randomSync().string;

  // Validate field data
  const validatedFieldData = await validateFieldData(
    fieldDataValidationJson,
    unvalidatedFieldData
  );

  // Return INVALID_DATA error if field data is not valid.
  if (!validatedFieldData) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.INVALID_DATA,
    };
  }

  const fieldDataParams: S3Put = {
    Bucket: reportBucket,
    Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    Body: JSON.stringify(validatedFieldData),
    ContentType: "application/json",
  };

  const formTemplateParams: S3Put = {
    Bucket: reportBucket,
    Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
    Body: JSON.stringify(formTemplate),
    ContentType: "application/json",
  };

  try {
    await s3Lib.put(fieldDataParams);
    await s3Lib.put(formTemplateParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.S3_OBJECT_CREATION_ERROR,
    };
  }

  const validatedMetadata = await validateData(metadataValidationSchema, {
    ...unvalidatedMetadata,
  });

  // Return INVALID_DATA error if metadata is not valid.
  if (!validatedMetadata) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.INVALID_DATA,
    };
  }

  // Create DyanmoDB record.
  const reportMetadataParams = {
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

  try {
    await dynamoDb.put(reportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_CREATION_ERROR,
    };
  }

  return {
    status: StatusCodes.CREATED,
    body: {
      ...reportMetadataParams.Item,
      fieldData: validatedFieldData,
      formTemplate,
    },
  };
});
