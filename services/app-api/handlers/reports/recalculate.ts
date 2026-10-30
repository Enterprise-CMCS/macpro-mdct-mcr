import handler from "../handler-lib";
import { GetCommandInput, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import { GetObjectCommandInput } from "@aws-sdk/client-s3";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
import {
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
// types
import { AnyObject, isState, ReportStatus, UserRoles } from "../../utils/types";

/**
 * Recalculates a report's completionStatus / isComplete from its current
 * field data and persists the result to the report metadata table.
 *
 * The stored completion status is normally only refreshed when a report is
 * saved, so it can go stale when validation rules change after the last save
 * (e.g. a field promoted from optional to required). The Review & Submit page
 * calls this so the section statuses reflect the current rules.
 *
 * Only completionStatus and isComplete are written; lastAltered, lastAlteredBy,
 * and status are intentionally untouched. Submitted, locked, or archived
 * reports are returned unchanged.
 */
export const recalculateReport = handler(async (event, _context) => {
  const requiredParams = ["reportType", "state", "id"];
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters, requiredParams)
  ) {
    return badRequest(error.NO_KEY);
  }

  const { reportType, state, id } = event.pathParameters;

  if (!isState(state)) {
    return badRequest(error.NO_KEY);
  }
  // Same write permission as update/submit: state users of the matching state
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportTable = reportTables[reportType as keyof typeof reportTables];
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];

  const reportMetadataParams: GetCommandInput = {
    TableName: reportTable,
    Key: { id, state },
  };

  const response = await dynamoDb.get(reportMetadataParams);
  if (!response?.Item) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  const reportMetadata = response.Item as AnyObject;
  const { status, locked, archived, fieldDataId, formTemplateId } =
    reportMetadata;

  // Submitted, locked, and archived reports keep their stored snapshot
  if (status === ReportStatus.SUBMITTED || locked || archived) {
    return ok(reportMetadata);
  }

  const formTemplateParams: GetObjectCommandInput = {
    Bucket: reportBucket,
    Key: getFormTemplateKey(formTemplateId),
  };

  let formTemplate;
  try {
    formTemplate = (await s3Lib.get(formTemplateParams)) as AnyObject;
  } catch {
    return internalServerError(error.S3_OBJECT_GET_ERROR);
  }
  if (!formTemplate) {
    return notFound(error.MISSING_FORM_TEMPLATE);
  }

  const fieldDataParams: GetObjectCommandInput = {
    Bucket: reportBucket,
    Key: getFieldDataKey(state, fieldDataId),
  };

  let fieldData;
  try {
    fieldData = (await s3Lib.get(fieldDataParams)) as AnyObject;
  } catch {
    return internalServerError(error.S3_OBJECT_GET_ERROR);
  }
  if (!fieldData) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  const completionStatus = await calculateCompletionStatus(
    fieldData,
    formTemplate
  );
  const reportIsComplete = isComplete(completionStatus);

  // Targeted update so concurrent saves are not overwritten
  const updateParams: UpdateCommandInput = {
    TableName: reportTable,
    Key: { id, state },
    UpdateExpression:
      "SET completionStatus = :completionStatus, isComplete = :isComplete",
    ExpressionAttributeValues: {
      ":completionStatus": completionStatus,
      ":isComplete": reportIsComplete,
    },
  };

  try {
    await dynamoDb.update(updateParams);
  } catch {
    return internalServerError(error.DYNAMO_UPDATE_ERROR);
  }

  return ok({
    ...reportMetadata,
    completionStatus,
    isComplete: reportIsComplete,
  });
});
