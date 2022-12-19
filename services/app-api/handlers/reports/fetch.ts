import KSUID from "ksuid";
import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { AnyObject, StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";
import { S3 } from "aws-sdk";

export const fetchReport = handler(async (event, _context) => {
  // console.log("Fetching Report");
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const state = event.pathParameters.state;
  const reportId = event.pathParameters.id;

  const fieldDataId: string = KSUID.randomSync().string;
  const formTemplateId: string = KSUID.randomSync().string;

  const s3 = new S3();
  const templateParams = {
    Bucket: "database-winter-storm-create-mcpar-446712541566",
    Key: "/formTemplates/" + state + "/" + formTemplateId,
  };

  const template = await getObjectWrapper(s3, templateParams);

  const dataParams = {
    Bucket: "database-winter-storm-create-mcpar-446712541566",
    Key: "/fieldData/" + state + "/" + fieldDataId,
  };
  const data = await getObjectWrapper(s3, dataParams);

  const params = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Key: {
      state: event.pathParameters.state,
      id: reportId,
    },
  };
  const response = await dynamoDb.get(params);

  let status = StatusCodes.SUCCESS;
  if (!response?.Item || !template || !data) {
    status = StatusCodes.NOT_FOUND;
  }

  const report: any = response.Item;

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

const getObjectWrapper = (s3: S3, params: { Bucket: string; Key: string }) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err: any, result: any) {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve(JSON.parse(result.Body));
      }
    });
  });
};
