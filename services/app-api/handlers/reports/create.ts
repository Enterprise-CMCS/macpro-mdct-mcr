import KSUID from "ksuid";
import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
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
  reportFormBuckets,
} from "../../utils/constants/constants";

export const createReport = handler(async (event, _context) => {
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  // Return error if no state is passed.
  if (!event.pathParameters?.state || !event.pathParameters) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const state: string = event.pathParameters.state;
  const unvalidatedPayload = JSON.parse(event!.body!);
  const reportType = unvalidatedPayload.metadata.reportType;
  const {
    metadata: unvalidatedMetadata,
    fieldData: unvalidatedFieldData,
    formTemplate,
  } = unvalidatedPayload;
  const fieldDataValidationJson = formTemplate.validationJson;

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
    Bucket: reportFormBuckets[reportType as keyof typeof reportFormBuckets],
    Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    Body: JSON.stringify(validatedFieldData),
    ContentType: "application/json",
  };

  const formTemplateParams: S3Put = {
    Bucket: reportFormBuckets[reportType as keyof typeof reportFormBuckets],
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
    TableName: reportTables[reportType as keyof typeof reportFormBuckets],
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
    body: { ...reportMetadataParams.Item },
  };
});
