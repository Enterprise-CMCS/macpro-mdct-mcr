import handler from "../handler-lib";
import KSUID from "ksuid";
import { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { PutCommandInput } from "@aws-sdk/lib-dynamodb";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import s3Lib, { getFieldDataKey } from "../../utils/s3/s3-lib";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  validateData,
  validateFieldData,
} from "../../utils/validation/validation";
import { metadataValidationSchema } from "../../utils/validation/schemas";
import {
  error,
  reportTables,
  reportBuckets,
} from "../../utils/constants/constants";
import { getOrCreateFormTemplate } from "../../utils/formTemplates/formTemplates";
import {
  copyFieldDataFromSource,
  makePCCMModifications,
} from "../../utils/reports/reports";
// types
import {
  isReportType,
  isState,
  StatusCodes,
  UserRoles,
} from "../../utils/types";

export const createReport = handler(async (event, _context) => {
  const requiredParams = ["reportType", "state"];
  // Return bad request if missing required parameters
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters, requiredParams)
  ) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const { state, reportType } = event.pathParameters;
  if (!isState(state)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }
  const unvalidatedPayload = JSON.parse(event.body!);
  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  if (!isReportType(reportType)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const reportBucket = reportBuckets[reportType];
  const reportTable = reportTables[reportType];

  let formTemplate, formTemplateVersion;

  const isProgramPCCM =
    unvalidatedMetadata?.programIsPCCM?.[0]?.value === "Yes";

  const julyMcparRelease = unvalidatedMetadata?.julyMcparRelease || false;
  const updateTopicXii = unvalidatedMetadata?.updateTopicXii || false;

  // eslint-disable-next-line no-useless-catch
  try {
    ({ formTemplate, formTemplateVersion } = await getOrCreateFormTemplate(
      reportBucket,
      reportType,
      isProgramPCCM,
      julyMcparRelease,
      updateTopicXii
    ));
  } catch (e) {
    throw e;
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
  const formTemplateId: string = formTemplateVersion?.id;

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

  // If the `copyFieldDataSourceId` parameter is passed, merge the validated field data with the source ids data.

  let newFieldData;

  if (unvalidatedMetadata.copyFieldDataSourceId) {
    newFieldData = await copyFieldDataFromSource(
      reportBucket,
      state,
      unvalidatedMetadata.copyFieldDataSourceId,
      formTemplate,
      validatedFieldData,
      reportType
    );
  } else {
    newFieldData = validatedFieldData;
  }

  // make necessary modifications for PCCM
  if (isProgramPCCM) {
    newFieldData = makePCCMModifications(newFieldData);
  }

  const fieldDataParams: PutObjectCommandInput = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
    Body: JSON.stringify(newFieldData),
    ContentType: "application/json",
  };

  try {
    await s3Lib.put(fieldDataParams);
  } catch {
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
  const reportMetadataParams: PutCommandInput = {
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
  } catch {
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
