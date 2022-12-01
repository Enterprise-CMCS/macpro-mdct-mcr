import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { AnyObject, StatusCodes } from "../../utils/types/types";
import error from "../../utils/constants/constants";

export const fetchReport = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.id!) {
    throw new Error(error.NO_KEY);
  }
  const params = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
    Key: {
      state: event.pathParameters.state,
      id: event.pathParameters.id,
    },
  };
  const response = await dynamoDb.get(params);

  let status = StatusCodes.SUCCESS;
  if (!response?.Item) {
    status = StatusCodes.NOT_FOUND;
  }
  return {
    status: status,
    body: response.Item,
  };
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

    /*
     * Remove formTemplate and formData to get rid of excessive size that isn't needed
     * on the dashboard when this call is used
     */
    const items: AnyObject[] = results.Items;
    items.forEach((item: any) => {
      delete item["formTemplate"];
      delete item["formData"];
    });
    existingItems.push(...items);
  } while (startingKey);

  return {
    status: StatusCodes.SUCCESS,
    body: existingItems,
  };
});
