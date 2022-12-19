import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { AnyObject, S3Get, StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";

export const fetchReport = handler(async (event, _context) => {
  // console.log("Fetching Report");
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const state = event.pathParameters.state;
  const reportId = event.pathParameters.id;

  const params = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Key: {
      state: state,
      id: reportId,
    },
  };
  const response = await dynamoDb.get(params);
  const report: any = response.Item;

  const templateParams: S3Get = {
    Bucket: process.env.MCPAR_FORM_BUCKET || "",
    Key: `formTemplates/${state}/${report?.formTemplateId as string}.json`,
  };

  const template: any = await s3Lib.get(templateParams);

  const dataParams = {
    Bucket: process.env.MCPAR_FORM_BUCKET || "",
    Key: `fieldData/${state}/${report?.fieldDataId as string}.json`,
  };
  const data: any = await s3Lib.get(dataParams);

  let status = StatusCodes.SUCCESS;
  if (!response?.Item || !template || !data) {
    status = StatusCodes.NOT_FOUND;
  }

  return {
    status: status,
    body: { ...report, formTemplate: template, fieldData: data },
  };
});

export const fetchReportsByState = handler(async (event, _context) => {
  // console.log("Fetching Reports By State");
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
