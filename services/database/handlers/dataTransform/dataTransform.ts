/* eslint-disable no-console */
import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const UPDATE_ARCHIVED = false;
const UPDATE_SUBMITTED = false;
const TEXT_TO_REPLACE =
  "What percent of the plan’s encounter data file submissions (submitted during the reporting period) met state requirements for timely submission?</br>If the state has not yet received any encounter data file submissions for the entire contract period when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting period.";
const REPLACEMENT_TEXT =
  "Enter the percentage of the plan’s encounter data file submissions (submitted during the reporting year) that met state requirements for timely submission. If the state has not yet received any encounter data file submissions for the entire contract year when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting year.";
const EXECUTE_UPDATE = true;

export const handler = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // CONFIGURE DYNAMODB
  const { dynamoClient, tableName } = initializeDynamoDb();

  // READ EXISTING DYNAMODB DATA
  const scanParams = {
    TableName: tableName,
  };
  const existingData = await dynamoClient.scan(scanParams).promise();
  const existingItems = existingData?.Items;
  console.log({ existingItems });

  // for each item find which ones match the change case
  if (existingItems) {
    let itemsToChange = filterReportsOnCondition(existingItems);
    // GET ITEMS TO CHANGE

    console.log("List of items to change", itemsToChange);

    // TRANSFORM DATA
    itemsToChange = filterItemsMatchingCondition(itemsToChange);

    console.log("Items after change", itemsToChange);

    // UPLOAD BACK TO DYNAMODB
    if (EXECUTE_UPDATE) {
      writeItemsToDb(itemsToChange, tableName, dynamoClient);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished data transform script",
    }),
  };
};

const writeItemsToDb = (
  updatedItems: any,
  tableName: string,
  dynamoClient: any
) => {
  updatedItems.forEach(async (item: any) => {
    const params = {
      TableName: tableName,
      Item: {
        ...item,
      },
    };
    await dynamoClient.put(params).promise();
  });
};

const filterItemsMatchingCondition = (itemsToChange: any) => {
  return itemsToChange.filter((item: any) => {
    const newTemplate = adjustObject(item.formTemplate);
    item.formTemplate = newTemplate;
    return item;
  });
};

const filterReportsOnCondition = (itemsToChange: any) => {
  // filter out archived reports
  if (!UPDATE_ARCHIVED) {
    itemsToChange = itemsToChange.filter((item: any) => !item.archived);
  }
  // filter out submitted reports
  if (!UPDATE_SUBMITTED) {
    itemsToChange = itemsToChange.filter((item: any) => !item.submittedBy);
  }
  return itemsToChange;
};

const initializeDynamoDb = () => {
  let dynamoPrefix;
  const dynamoConfig: any = {};
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    dynamoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
    dynamoPrefix = "local";
  } else {
    dynamoConfig["region"] = "us-east-1";
    dynamoPrefix = process.env.dynamoPrefix;
  }
  const dynamoClient = new DynamoDB.DocumentClient(dynamoConfig);

  const tableName = dynamoPrefix + "-mcpar-reports";
  return { dynamoClient, tableName };
};

// adjust string
const adjustString = (string: string) => {
  return string.replace(TEXT_TO_REPLACE, REPLACEMENT_TEXT);
};

// iterates over array items, sanitizing items recursively
const adjustArray = (array: unknown[]): unknown[] =>
  array.map((entry: unknown) => adjustEntry(entry));

// iterates over object key-value pairs, sanitizing values recursively
const adjustObject = (object: { [key: string]: unknown }) => {
  if (object) {
    const entries = Object.entries(object);
    const adjustedEntries = entries.map((entry: [string, unknown]) => {
      const [key, value] = entry;
      return [key, adjustEntry(value)];
    });
    return Object.fromEntries(adjustedEntries);
  }
};

const adjusterMap: any = {
  string: adjustString,
  array: adjustArray,
  object: adjustObject,
};

// return adjusted entry, or if safe type, return entry
const adjustEntry = (entry: unknown) => {
  const entryType = Array.isArray(entry) ? "array" : typeof entry;
  const adjuster = adjusterMap[entryType];
  return adjuster?.(entry) || entry;
};
