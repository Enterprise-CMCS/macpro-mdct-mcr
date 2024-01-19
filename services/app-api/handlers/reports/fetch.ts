import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import handler from "../handler-lib";
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
// types
import { AnyObject, isState, S3Get, StatusCodes } from "../../utils/types";

export const fetchReport = handler(async (event, _context) => {
  const requiredParams = ["reportType", "id", "state"];
  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const { reportType, state, id } = event.pathParameters!;

  if (!isState(state)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
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
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NOT_IN_DATABASE,
      };
    }

    const reportMetadata = response.Item as Record<string, any>;
    const { formTemplateId, fieldDataId } = reportMetadata;

    // Get form template from S3
    const formTemplateParams: S3Get = {
      Bucket: reportBucket,
      Key: getFormTemplateKey(formTemplateId),
    };

    const formTemplate = (await s3Lib.get(formTemplateParams)) as AnyObject; // TODO: strict typing
    if (!formTemplate) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.MISSING_FORM_TEMPLATE,
      };
    }

    // Get field data from S3
    const fieldDataParams: S3Get = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
    };

    const fieldData = (await s3Lib.get(fieldDataParams)) as AnyObject; // TODO: strict typing

    if (!fieldData) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NO_MATCHING_RECORD,
      };
    }

    if (!reportMetadata.completionStatus) {
      reportMetadata.completionStatus = await calculateCompletionStatus(
        fieldData,
        formTemplate
      );
      reportMetadata.isComplete = isComplete(reportMetadata.completionStatus);
    }

    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...reportMetadata,
        formTemplate,
        fieldData,
      },
    };
  } catch (err) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }
});

export const fetchReportsByState = handler(async (event, _context) => {
  const requiredParams = ["reportType", "state"];

  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const reportType = event.pathParameters?.reportType;

  const reportTable = reportTables[reportType as keyof typeof reportTables];

  const queryParams: QueryCommandInput = {
    TableName: reportTable,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": event.pathParameters?.state!,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };

  const reportsByState = dynamoDb.queryAll(queryParams);

  return {
    status: StatusCodes.SUCCESS,
    body: reportsByState,
  };
});
