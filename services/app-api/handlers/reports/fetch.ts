import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, StatusCodes } from "../../utils/types/types";
import {
  error,
  buckets,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export const fetchReport = handler(async (event, _context) => {
  const requiredParams = ["reportType", "id", "state"];
  if (!hasReportPathParams(event.pathParameters!, requiredParams)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const { reportType, state, id } = event.pathParameters!;

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
      Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
    };

    const formTemplate = await s3Lib.get(formTemplateParams); // TODO: strict typing
    if (!formTemplate) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.MISSING_FORM_TEMPLATE,
      };
    }

    // Get field data from S3
    const fieldDataParams: S3Get = {
      Bucket: reportBucket,
      Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    };

    const fieldData = await s3Lib.get(fieldDataParams); // TODO: strict typing

    if (!fieldData) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NO_MATCHING_RECORD,
      };
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

interface DynamoFetchParams {
  TableName: string;
  KeyConditionExpression: string;
  ExpressionAttributeValues: Record<string, string>;
  ExpressionAttributeNames: Record<string, string>;
  ExclusiveStartKey?: DocumentClient.Key;
}

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

  const queryParams: DynamoFetchParams = {
    TableName: reportTable,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": event.pathParameters?.state!,
    },
    ExpressionAttributeNames: {
      "#state": "state",
    },
  };

  let startingKey;
  let existingItems = [];
  let results;

  const queryTable = async (startingKey?: DocumentClient.Key) => {
    queryParams.ExclusiveStartKey = startingKey;
    let results = await dynamoDb.query(queryParams);
    if (results.LastEvaluatedKey) {
      startingKey = results.LastEvaluatedKey;
      return [startingKey, results];
    } else {
      return [null, results];
    }
  };

  // Looping to perform complete scan of tables due to 1 mb limit per iteration
  do {
    [startingKey, results] = await queryTable(startingKey);
    const items: AnyObject[] = results?.Items;
    existingItems.push(...items);
  } while (startingKey);

  return {
    status: StatusCodes.SUCCESS,
    body: existingItems,
  };
});
