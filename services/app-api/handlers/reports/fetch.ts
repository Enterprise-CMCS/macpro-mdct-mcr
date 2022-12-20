import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const fetchReport = handler(async (event, _context) => {
  let status, body;
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const state = event.pathParameters.state;
  const reportId = event.pathParameters.id;

  // get current report metadata
  const reportMetadataParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Key: { state, id: reportId },
  };
  const response = await dynamoDb.get(reportMetadataParams);
  const reportMetadata: any = response.Item; // TODO: strict typing
  const { formTemplateId, fieldDataId } = reportMetadata;

  // get formTemplate from s3 bucket
  const formTemplateParams: S3Get = {
    Bucket: process.env.MCPAR_FORM_BUCKET!,
    Key: `formTemplates/${state}/${formTemplateId}.json`,
  };
  const formTemplate: any = await s3Lib.get(formTemplateParams); // TODO: strict typing

  // get fieldData from s3 bucket
  const fieldDataParams = {
    Bucket: process.env.MCPAR_FORM_BUCKET!,
    Key: `fieldData/${state}/${fieldDataId}.json`,
  };
  const fieldData: any = await s3Lib.get(fieldDataParams); // TODO: strict typing

  // if any of the three could not be found, return error
  if (!response?.Item || !formTemplate || !fieldData) {
    status = StatusCodes.NOT_FOUND;
    body = error.NO_MATCHING_RECORD;
  } else {
    status = StatusCodes.SUCCESS;
    body = { ...reportMetadata, formTemplate, fieldData };
  }
  return { status, body };
});

export const fetchReportsByState = handler(async (event, _context) => {
  if (!event?.pathParameters?.state!) {
    throw new Error(error.NO_KEY);
  }
  let queryParams: any = {
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
