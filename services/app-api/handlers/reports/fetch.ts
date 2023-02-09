import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, StatusCodes } from "../../utils/types/types";
import { error, buckets } from "../../utils/constants/constants";

export const fetchReport = handler(async (event, _context) => {
  let status, body;
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const state = event.pathParameters.state;
  const reportId = event.pathParameters.id;

  // get current report metadata
  const reportMetadataParams = {
    // TODO: chain other report types
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Key: { state, id: reportId },
  };
  try {
    const response = await dynamoDb.get(reportMetadataParams);
    if (!response?.Item) throw error.NOT_IN_DATABASE;
    const reportMetadata: any = response.Item; // TODO: strict typing
    const { formTemplateId, fieldDataId } = reportMetadata;

    // get formTemplate from s3 bucket
    const formTemplateParams: S3Get = {
      // TODO: chain other report types
      Bucket: process.env.MCPAR_FORM_BUCKET!,
      Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
    };
    const formTemplate: any = await s3Lib.get(formTemplateParams); // TODO: strict typing
    if (!formTemplate) throw error.MISSING_FORM_TEMPLATE;

    // get fieldData from s3 bucket
    const fieldDataParams = {
      // TODO: chain other report types
      Bucket: process.env.MCPAR_FORM_BUCKET!,
      Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    };
    const fieldData: any = await s3Lib.get(fieldDataParams); // TODO: strict typing
    if (!fieldData) throw error.MISSING_FIELD_DATA;

    status = StatusCodes.SUCCESS;
    body = { ...reportMetadata, formTemplate, fieldData };
  } catch (err) {
    status = StatusCodes.NOT_FOUND;
    body = error.NO_MATCHING_RECORD;
  }
  return { status, body };
});

export const fetchReportsByState = handler(async (event, _context) => {
  if (!event?.pathParameters?.state!) {
    throw new Error(error.NO_KEY);
  }

  let queryParams: any = {
    // TODO: chain other report types
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

  const queryTable = async (startingKey?: any) => {
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
    const items: AnyObject[] = results.Items;
    existingItems.push(...items);
  } while (startingKey);

  return {
    status: StatusCodes.SUCCESS,
    body: existingItems,
  };
});
