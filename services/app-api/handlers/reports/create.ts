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
import {
  badRequest,
  created,
  forbidden,
  internalServerError,
} from "../../utils/responses/response-lib";
// types
import { isReportType, isState, UserRoles } from "../../utils/types";

export const createReport = handler(async (event, _context) => {
  const requiredParams = ["reportType", "state"];
  // Return bad request if missing required parameters
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters, requiredParams)
  ) {
    return badRequest(error.NO_KEY);
  }

  const { state, reportType } = event.pathParameters;
  if (!isState(state)) {
    return badRequest(error.NO_KEY);
  }
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }
  const unvalidatedPayload = JSON.parse(event.body!);
  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  if (!isReportType(reportType)) {
    return badRequest(error.NO_KEY);
  }

  const reportBucket = reportBuckets[reportType];
  const reportTable = reportTables[reportType];

  let formTemplate, formTemplateVersion;

  const hasNaaarSubmission =
    unvalidatedMetadata?.naaarSubmissionForThisProgram?.[0]?.value.includes(
      "Yes"
    );
  const isPccm = unvalidatedMetadata?.programIsPCCM?.[0]?.value === "Yes";
  const qualityMeasuresEnabled =
    unvalidatedMetadata?.qualityMeasuresEnabled === true;

  // eslint-disable-next-line no-useless-catch
  try {
    ({ formTemplate, formTemplateVersion } = await getOrCreateFormTemplate(
      reportBucket,
      reportType,
      { hasNaaarSubmission, isPccm, qualityMeasuresEnabled }
    ));
  } catch (e) {
    throw e;
  }

  // Return MISSING_DATA error if missing unvalidated data or validators.
  if (!unvalidatedFieldData || !formTemplate.validationJson) {
    return badRequest(error.MISSING_DATA);
  }

  // Create report and field ids.
  const reportId: string = KSUID.randomSync().string;
  const fieldDataId: string = KSUID.randomSync().string;
  const formTemplateId: string = formTemplateVersion?.id;

  const validationSchema = formTemplate.validationJson;
  if (reportType === "NAAAR") {
    // this entity does not have validation specified in the form template
    validationSchema["analysisMethods"] = "objectArray";
  }

  // Validate field data
  let validatedFieldData;
  try {
    validatedFieldData = await validateFieldData(
      validationSchema,
      unvalidatedFieldData
    );
  } catch {
    return badRequest(error.INVALID_DATA);
  }

  // Return INVALID_DATA error field data has no valid entries
  if (validatedFieldData && Object.keys(validatedFieldData).length === 0) {
    return internalServerError(error.INVALID_DATA);
  }

  // If the `copyFieldDataSourceId` parameter is passed, merge the validated field data with the source ids data.

  let newFieldData;

  if (unvalidatedMetadata.copyFieldDataSourceId) {
    newFieldData = await copyFieldDataFromSource(
      reportBucket,
      state,
      unvalidatedMetadata.copyFieldDataSourceId,
      formTemplate,
      validatedFieldData!,
      reportType
    );
  } else {
    newFieldData = validatedFieldData;
  }

  // make necessary modifications for PCCM
  if (isPccm) {
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
    return internalServerError(error.S3_OBJECT_CREATION_ERROR);
  }

  let validatedMetadata;
  try {
    validatedMetadata = await validateData(metadataValidationSchema, {
      ...unvalidatedMetadata,
    });
  } catch {
    // Return INVALID_DATA error if metadata is not valid.
    return badRequest(error.INVALID_DATA);
  }

  // Create DynamoDB record.
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
    return internalServerError(error.DYNAMO_CREATION_ERROR);
  }

  return created({
    ...reportMetadataParams.Item,
    fieldData: validatedFieldData,
    formTemplate,
    formTemplateVersion: formTemplateVersion?.versionNumber,
  });
});
