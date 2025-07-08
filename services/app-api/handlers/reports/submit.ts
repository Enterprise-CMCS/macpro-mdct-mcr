import jwtDecode from "jwt-decode";
import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import {
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
import { convertDateUtcToEt } from "../../utils/time/time";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import {
  badRequest,
  conflict,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
// types
import {
  ReportStatus,
  isState,
  MCPARReportMetadata,
  MLRReportMetadata,
  UserRoles,
  NAAARReportMetadata,
} from "../../utils/types";

export const submitReport = handler(async (event, _context) => {
  const requiredParams = ["id", "reportType", "state"];
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters, requiredParams)
  ) {
    return badRequest(error.NO_KEY);
  }

  const { id, state, reportType } = event.pathParameters;

  if (!isState(state)) {
    return badRequest(error.NO_KEY);
  }
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportTable = reportTables[reportType as keyof typeof reportTables];
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];

  // Get report metadata
  const reportMetadataParams = {
    TableName: reportTable,
    Key: { id, state },
  };

  const response = await dynamodbLib.get(reportMetadataParams);
  if (!response?.Item) {
    return notFound(error.NOT_IN_DATABASE);
  }

  const reportMetadata = response.Item as
    | MLRReportMetadata
    | MCPARReportMetadata
    | NAAARReportMetadata;
  const { status, isComplete, fieldDataId, formTemplateId } = reportMetadata;

  if (status === "Submitted") {
    return ok(reportMetadata);
  }

  if (!isComplete) {
    return conflict(error.REPORT_INCOMPLETE);
  }

  const jwt = jwtDecode(event.headers["x-api-key"]!) as Record<
    string,
    string | boolean
  >;

  const date = Date.now();
  const fullName = `${jwt.given_name} ${jwt.family_name}`;
  const submittedReportMetadata = {
    ...reportMetadata,
    submittedBy: fullName,
    submittedOnDate: date,
    submissionDates: [
      ...(reportMetadata.submissionDates || []),
      {
        fieldDataId: reportMetadata.fieldDataId,
        submittedOnDate: date,
      },
    ],
    status: ReportStatus.SUBMITTED,
    locked: true,
    submissionCount: reportMetadata.submissionCount + 1,
  };

  const submitReportParams = {
    TableName: reportTable,
    Item: submittedReportMetadata,
  };
  try {
    await dynamodbLib.put(submitReportParams);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  // Get field data
  const fieldDataParams = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
  };

  let existingFieldData;

  try {
    existingFieldData = (await s3Lib.get(fieldDataParams)) as Record<
      string,
      any
    >;
  } catch {
    return internalServerError(error.S3_OBJECT_GET_ERROR);
  }

  const fieldData = {
    ...existingFieldData,
    submitterName: fullName,
    submitterEmailAddress: jwt.email,
    reportSubmissionDate: convertDateUtcToEt(date),
  };

  const updateFieldDataParams = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
    Body: JSON.stringify(fieldData),
    ContentType: "application/json",
  };

  const getFormTemplateParams = {
    Bucket: reportBucket,
    Key: getFormTemplateKey(formTemplateId),
  };

  let formTemplate;

  try {
    formTemplate = (await s3Lib.get(getFormTemplateParams)) as Record<
      string,
      any
    >;
  } catch {
    return internalServerError(error.S3_OBJECT_GET_ERROR);
  }

  try {
    await s3Lib.put(updateFieldDataParams);
  } catch {
    return internalServerError(error.S3_OBJECT_UPDATE_ERROR);
  }

  return ok({
    ...submittedReportMetadata,
    fieldData: { ...fieldData },
    formTemplate: {
      ...formTemplate,
    },
  });
});
