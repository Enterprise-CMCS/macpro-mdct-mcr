import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, StatusCodes } from "../../utils/types/types";
import { error, buckets } from "../../utils/constants/constants";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import {
  calculateCompletionStatus,
  isComplete,
} from "../../utils/validation/completionStatus";

export const fetchReport = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const { state, id } = event.pathParameters;

  // Get current report metadata
  const reportMetadataParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
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
      Bucket: process.env.MCPAR_FORM_BUCKET!,
      Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
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
      Bucket: process.env.MCPAR_FORM_BUCKET!,
      Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
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

interface DynamoFetchParams {
  TableName: string;
  KeyConditionExpression: string;
  ExpressionAttributeValues: Record<string, string>;
  ExpressionAttributeNames: Record<string, string>;
  ExclusiveStartKey?: DocumentClient.Key;
}

export const fetchReportsByState = handler(async (event, _context) => {
  if (!event?.pathParameters?.state!) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const queryParams: DynamoFetchParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    KeyConditionExpression: "#state = :state",
    ExpressionAttributeValues: {
      ":state": event.pathParameters.state,
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
