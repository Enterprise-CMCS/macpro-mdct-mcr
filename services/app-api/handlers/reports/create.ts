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
import { isReportType, S3Put, StatusCodes, UserRoles } from "../../utils/types";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import { logger } from "../../utils/logging";

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
  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  const possibleReportType: unknown = event?.pathParameters?.reportType;
  if (!isReportType(possibleReportType)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const reportType = possibleReportType;

  // Return a 403 status if the user does not have access to this report
  if (!hasReportAccess(event, possibleReportType)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];
  const reportTable = reportTables[reportType as keyof typeof reportTables];

  let formTemplate, formTemplateVersion;

  try {
    ({ formTemplate, formTemplateVersion } = await getOrCreateFormTemplate(
      reportBucket,
      reportType
    ));
  } catch (err) {
    logger.error(err, "Error getting or creating template");
    throw err;
  }

  // Return MISSING_DATA error if missing unvalidated data or validators.
  if (!unvalidatedFieldData || !formTemplate.validationJson) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  // Create report and field ids.
  const reportId: string = KSUID.randomSync().string;
  const fieldDataId: string = KSUID.randomSync().string;
  const formTemplateId = formTemplateVersion?.id;

  // Validate field data
  const validatedFieldData = await validateFieldData(
    formTemplate.validationJson,
    unvalidatedFieldData
  );

  // Return INVALID_DATA error if field data is not valid.
  if (!validatedFieldData || Object.keys(validatedFieldData).length === 0) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.INVALID_DATA,
    };
  }

  const fieldDataParams: S3Put = {
    Bucket: reportBucket,
    Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    Body: JSON.stringify(validatedFieldData),
    ContentType: "application/json",
  };

  try {
    await s3Lib.put(fieldDataParams);
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
      status: "Not started",
      formTemplateId,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      versionNumber: formTemplateVersion?.versionNumber,
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
      formTemplateVersion: formTemplateVersion?.versionNumber,
    },
  };
});
