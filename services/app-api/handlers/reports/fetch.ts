import handler from "../handler-lib";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
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
import { isAuthorizedToFetchState } from "../../utils/auth/authorization";
import {
  badRequest,
  forbidden,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
// types
import { AnyObject, isState } from "../../utils/types";

export const fetchReport = handler(async (event, _context) => {
  const requiredParams = ["reportType", "id", "state"];
  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return badRequest(error.NO_KEY);
  }

  const { reportType, state, id } = event.pathParameters!;

  if (!isState(state)) {
    return badRequest(error.NO_KEY);
  }
  if (!isAuthorizedToFetchState(event, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportTable = reportTables[reportType as keyof typeof reportTables];
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];

  // Get current report metadata
  const reportMetadataParams = {
    TableName: reportTable,
    Key: { state, id },
  };

  try {
    const response = await dynamoDb.get(reportMetadataParams);
    if (!response?.Item) {
      return notFound(error.NO_MATCHING_RECORD);
    }

    const reportMetadata = response.Item as Record<string, any>;
    const { formTemplateId, fieldDataId } = reportMetadata;

    // Get form template from S3
    const formTemplateParams: GetObjectCommandInput = {
      Bucket: reportBucket,
      Key: getFormTemplateKey(formTemplateId),
    };

    const formTemplate = (await s3Lib.get(formTemplateParams)) as AnyObject; // TODO: strict typing
    if (!formTemplate) {
      return notFound(error.NO_MATCHING_RECORD);
    }

    // Get field data from S3
    const fieldDataParams: GetObjectCommandInput = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
    };

    const fieldData = (await s3Lib.get(fieldDataParams)) as AnyObject; // TODO: strict typing

    if (!fieldData) {
      return notFound(error.NO_MATCHING_RECORD);
    }

    if (!reportMetadata.completionStatus) {
      reportMetadata.completionStatus = await calculateCompletionStatus(
        fieldData,
        formTemplate
      );
      reportMetadata.isComplete = isComplete(reportMetadata.completionStatus);
    }

    return ok({
      ...reportMetadata,
      formTemplate,
      fieldData,
    });
  } catch {
    return notFound(error.NO_MATCHING_RECORD);
  }
});

export const fetchReportsByState = handler(async (event, _context) => {
  const requiredParams = ["reportType", "state"];

  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return badRequest(error.NO_KEY);
  }

  const { reportType, state } = event.pathParameters!;

  if (!isAuthorizedToFetchState(event, state!)) {
    return forbidden(error.UNAUTHORIZED);
  }

  const reportTable = reportTables[reportType as keyof typeof reportTables];

  const queryParams: QueryCommandInput = {
    TableName: reportTable,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": state,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };

  const reportsByState = await dynamoDb.queryAll(queryParams);

  return ok(reportsByState);
});
