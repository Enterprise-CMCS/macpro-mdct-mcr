import handler from "../handler-lib";
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
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";

export const updateReport = handler(async (event, context) => {
  const requiredParams = ["reportType", "id", "state"];
  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  // If request body is missing, return a 400 error.
  if (!event?.body) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  // Blacklisted keys
  const metadataBlacklist = [
    "submittedBy",
    "submittedOnDate",
    "locked",
    "archive",
  ];
  const fieldDataBlacklist = [
    "submitterName",
    "submitterEmailAddress",
    "reportSubmissionDate",
  ];

  try {
    const eventBody = JSON.parse(event.body);
    if (
      (eventBody.metadata &&
        Object.keys(eventBody.metadata).some((_) =>
          metadataBlacklist.includes(_)
        )) ||
      (eventBody.fieldData &&
        Object.keys(eventBody.fieldData).some((_) =>
          fieldDataBlacklist.includes(_)
        ))
    ) {
      return {
        status: StatusCodes.BAD_REQUEST,
        body: error.INVALID_DATA,
      };
    }
  } catch (err) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.INVALID_DATA,
    };
  }

  // Ensure user has correct permissions to update a report.
  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  // Get current report
  const reportEvent = { ...event, body: "" };
  const fetchReportRequest = await fetchReport(reportEvent, context);

  if (!fetchReportRequest?.body || fetchReportRequest.statusCode !== 200) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  // If current report exists, get formTemplateId and fieldDataId
  const currentReport = JSON.parse(fetchReportRequest.body);

  if (currentReport.archived) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const { formTemplateId, fieldDataId, reportType } = currentReport;

  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];
  const reportTable = reportTables[reportType as keyof typeof reportTables];

  if (!formTemplateId || !fieldDataId) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }

  const { state } = event.pathParameters!;

  const formTemplateParams = {
    Bucket: reportBucket,
    Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
  };
  const formTemplate = (await s3Lib.get(formTemplateParams)) as Record<
    string,
    any
  >;

  // Get existing fieldData from s3 bucket (for patching with passed data)
  const fieldDataParams = {
    Bucket: reportBucket,
    Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
  };
  const existingFieldData = (await s3Lib.get(fieldDataParams)) as Record<
    string,
    any
  >;

  // Parse the passed payload.
  const unvalidatedPayload = JSON.parse(event.body);

  const { metadata: unvalidatedMetadata, fieldData: unvalidatedFieldData } =
    unvalidatedPayload;

  if (!unvalidatedFieldData) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.MISSING_DATA,
    };
  }
  
  // Validate passed field data
  const validatedFieldData = await validateFieldData(
    formTemplate?.validationJson,
    unvalidatedFieldData
  );

  if (!validatedFieldData) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.INVALID_DATA,
    };
  }

  // Post validated field data to s3 bucket
  const fieldData = {
    ...existingFieldData,
    ...validatedFieldData,
  };

  const updateFieldDataParams = {
    Bucket: reportBucket,
    Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    Body: JSON.stringify(fieldData),
    ContentType: "application/json",
  };

  try {
    await s3Lib.put(updateFieldDataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.S3_OBJECT_UPDATE_ERROR,
    };
  }

  const completionStatus = await calculateCompletionStatus(
    fieldData,
    formTemplate
  );

  // validate report metadata
  const validatedMetadata = await validateData(metadataValidationSchema, {
    ...unvalidatedMetadata,
    completionStatus,
  });

  // If metadata fails validation, return 400
  if (!validatedMetadata) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.INVALID_DATA,
    };
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
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: {
      ...reportMetadataParams.Item,
      fieldData,
      formTemplate,
    },
  };
});
