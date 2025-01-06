import handler from "../handler-lib";
import { fetchReport } from "./fetch";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import { hasPermissions } from "../../utils/auth/authorization";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
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
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
// types
import { isState, ReportJson, UserRoles } from "../../utils/types";

export const updateReport = handler(async (event, context) => {
  const requiredParams = ["reportType", "id", "state"];
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters!, requiredParams)
  ) {
    return badRequest(error.NO_KEY);
  }

  const { state } = event.pathParameters!;

  if (!isState(state)) {
    return badRequest(error.NO_KEY);
  }

  // If request body is missing, return a 400 error.
  if (!event?.body) {
    return badRequest(error.MISSING_DATA);
  }

  // Blocklisted keys
  const metadataBlocklist = [
    "submittedBy",
    "submittedOnDate",
    "locked",
    "archive",
  ];
  const fieldDataBlocklist = [
    "submitterName",
    "submitterEmailAddress",
    "reportSubmissionDate",
  ];

  // This parse is guaranteed to succeed, because handler-lib already did it.
  const eventBody = JSON.parse(event.body);
  if (
    (eventBody.metadata &&
      Object.keys(eventBody.metadata).some((_) =>
        metadataBlocklist.includes(_)
      )) ||
    (eventBody.fieldData &&
      Object.keys(eventBody.fieldData).some((_) =>
        fieldDataBlocklist.includes(_)
      ))
  ) {
    return badRequest(error.INVALID_DATA);
  }

  // Ensure user has correct permissions to update a report.
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  // Get current report
  const reportEvent = { ...event, body: "" };
  const fetchReportRequest = await fetchReport(reportEvent, context);

  if (!fetchReportRequest?.body || fetchReportRequest.statusCode !== 200) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  // If current report exists, get formTemplateId and fieldDataId
  const currentReport = JSON.parse(fetchReportRequest.body);

  if (currentReport.archived || currentReport.locked) {
    return forbidden(error.UNAUTHORIZED);
  }

  const { formTemplateId, fieldDataId, reportType } = currentReport;

  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];
  const reportTable = reportTables[reportType as keyof typeof reportTables];

  if (!formTemplateId || !fieldDataId) {
    return notFound(error.MISSING_DATA);
  }

  const formTemplateParams = {
    Bucket: reportBucket,
    Key: getFormTemplateKey(formTemplateId),
  };
  const formTemplate = (await s3Lib.get(formTemplateParams)) as ReportJson;
  if (!formTemplate) {
    return notFound(error.MISSING_DATA);
  }

  // Get existing fieldData from s3 bucket (for patching with passed data)
  const fieldDataParams = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
  };
  const existingFieldData = (await s3Lib.get(fieldDataParams)) as Record<
    string,
    any
  >;
  if (!existingFieldData) {
    return notFound(error.MISSING_DATA);
  }

  // Parse the passed payload.
  const unvalidatedPayload = JSON.parse(event.body);

  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  if (!unvalidatedFieldData) {
    return badRequest(error.MISSING_DATA);
  }

  // Validation JSON should be there—if it's not, there's an issue.
  if (!formTemplate.validationJson) {
    return internalServerError(error.MISSING_FORM_TEMPLATE);
  }

  const validationSchema = formTemplate.validationJson;
  if (reportType === "NAAAR") {
    // this entity does not have validation specified in the form template
    validationSchema["analysisMethods"] = "objectArray";
  }

  // Validate passed field data
  let validatedFieldData;
  try {
    validatedFieldData = await validateFieldData(
      formTemplate.validationJson,
      unvalidatedFieldData
    );
  } catch {
    return badRequest(error.INVALID_DATA);
  }

  // Post validated field data to s3 bucket
  const fieldData = {
    ...existingFieldData,
    ...validatedFieldData,
  };

  const updateFieldDataParams = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
    Body: JSON.stringify(fieldData),
    ContentType: "application/json",
  };

  try {
    await s3Lib.put(updateFieldDataParams);
  } catch {
    return internalServerError(error.S3_OBJECT_UPDATE_ERROR);
  }

  const completionStatus = await calculateCompletionStatus(
    fieldData,
    formTemplate
  );

  // validate report metadata
  let validatedMetadata;
  try {
    validatedMetadata = await validateData(metadataValidationSchema, {
      ...unvalidatedMetadata,
      completionStatus,
    });
  } catch {
    // If metadata fails validation, return 400
    return badRequest(error.INVALID_DATA);
  }

  /*
   * Data has passed validation
   * Delete raw data prior to updating
   */
  delete currentReport.fieldData;
  delete currentReport.formTemplate;

  // Update record in report metadata table
  const reportMetadataParams = {
    TableName: reportTable,
    Item: {
      ...currentReport,
      ...validatedMetadata,
      isComplete: isComplete(completionStatus),
      lastAltered: Date.now(),
    },
  };

  try {
    await dynamoDb.put(reportMetadataParams);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  return ok({
    ...reportMetadataParams.Item,
    fieldData,
    formTemplate,
  });
});
