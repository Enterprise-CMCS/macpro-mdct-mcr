/* eslint-disable no-console */
import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const TABLE_SUFFIX = "mcpar-reports";
const UPDATE_ARCHIVED = false;
const UPDATE_SUBMITTED = false;
const OLDEST_REPORTING_PERIOD_START_DATE_TO_UPDATE = 0;
const TEXT_TO_REPLACE =
  "What percent of the plan’s encounter data file submissions (submitted during the reporting period) met state requirements for timely submission?<br>If the state has not yet received any encounter data file submissions for the entire contract period when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting period.";
const REPLACEMENT_TEXT =
  "Enter the percentage of the plan’s encounter data file submissions (submitted during the reporting year) that met state requirements for timely submission. If the state has not yet received any encounter data file submissions for the entire contract year when it submits this report, the state should enter here the percentage of encounter data submissions that were compliant out of the file submissions it has received from the managed care plan for the reporting year.";

let dynamoClient: any;
let tableName: any;

export const handler = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // CONFIGURE DYNAMODB
  initializeDynamoDb();

  // READ EXISTING DYNAMODB DATA
  const existingItems = await fetchExistingItems();
  console.log({ existingItems });

  // GET ITEMS TO CHANGE
  if (existingItems) {
    let itemsToChange = filterReportsOnConditions(existingItems);
    console.log("List of items to change", itemsToChange);

    // TRANSFORM DATA
    itemsToChange = modifyItemsMatchingChangeCase(itemsToChange);

    // UPLOAD BACK TO DYNAMODB
    if (process.env.DATA_TRANSFORM_UPDATE_ENABLED === "true") {
      const modifiedItems = await writeItemsToDb(itemsToChange);
      console.log({ modifiedItems });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished data transform script",
    }),
  };
};

const initializeDynamoDb = () => {
  let environmentPrefix;
  const dynamoConfig: any = {};
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    dynamoConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
    environmentPrefix = "local";
  } else {
    dynamoConfig["region"] = "us-east-1";
    environmentPrefix = process.env.DYNAMO_PREFIX;
  }
  dynamoClient = new DynamoDB.DocumentClient(dynamoConfig);
  tableName = environmentPrefix + "-" + TABLE_SUFFIX;
};

const scanTable = async (
  tableName: string,
  keepSearching: boolean,
  startingKey?: string
) => {
  let results = await dynamoClient
    .scan({
      TableName: tableName,
      ExclusiveStartKey: startingKey,
    })
    .promise();
  if (results.LastEvaluatedKey) {
    startingKey = results.LastEvaluatedKey;
    return [startingKey, keepSearching, results];
  } else {
    keepSearching = false;
    return [null, keepSearching, results];
  }
};

const fetchExistingItems = async () => {
  let startingKey;
  let keepSearching = true;
  let existingItems = [];
  let results;

  // Looping to perform complete scan of tables due to 1 mb limit per iteration
  while (keepSearching) {
    try {
      [startingKey, keepSearching, results] = await scanTable(
        tableName,
        keepSearching,
        startingKey
      );
      existingItems.push(...results.Items);
    } catch (err) {
      console.error(`Database scan failed for the table ${tableName}
                     with startingKey ${startingKey} and the keepSearching flag is ${keepSearching}.
                     Error: ${err}`);
      throw err;
    }
  }
  return existingItems;
};

const writeItemsToDb = async (updatedItems: any) => {
  console.log("Writing changes to table: ", tableName);
  let responses: any = [];
  for (const item of updatedItems) {
    const params = {
      TableName: tableName,
      Item: {
        ...item,
      },
      ReturnValues: "ALL_OLD",
    };
    try {
      const response = await dynamoClient.put(params).promise();
      responses.push(response);
    } catch (e) {
      console.log("error", e);
    }
  }
  return responses;
};

const filterReportsOnConditions = (itemsToChange: any) => {
  // filter out archived reports
  if (!UPDATE_ARCHIVED) {
    itemsToChange = itemsToChange.filter((item: any) => !item.archived);
  }
  // filter out submitted reports
  if (!UPDATE_SUBMITTED) {
    itemsToChange = itemsToChange.filter((item: any) => !item.submittedBy);
  }
  // filter out reports older than the provided start date
  if (OLDEST_REPORTING_PERIOD_START_DATE_TO_UPDATE) {
    itemsToChange = itemsToChange.filter(
      (item: any) =>
        item.reportingPeriodStartDate >
        OLDEST_REPORTING_PERIOD_START_DATE_TO_UPDATE
    );
  }
  return itemsToChange;
};

const modifyItemsMatchingChangeCase = (itemsToChange: any) => {
  return itemsToChange.filter((item: any) => {
    const newTemplate = parseObject(item.formTemplate);
    item.formTemplate = newTemplate;
    return item;
  });
};

// iterates over object key-value pairs, sanitizing values recursively
const parseObject = (object: { [key: string]: unknown }) => {
  if (object) {
    const entries = Object.entries(object);
    const adjustedEntries = entries.map((entry: [string, unknown]) => {
      const [key, value] = entry;
      return [key, parseEntry(value)];
    });
    return Object.fromEntries(adjustedEntries);
  }
};

// iterates over array items, sanitizing items recursively
const parseArray = (array: unknown[]): unknown[] =>
  array.map((entry: unknown) => parseEntry(entry));

// adjust string
const modifyString = (string: string) => {
  return string.replace(TEXT_TO_REPLACE, REPLACEMENT_TEXT);
};

const adjusterMap: any = {
  string: modifyString,
  array: parseArray,
  object: parseObject,
};

// return adjusted entry, or if safe type, return entry
const parseEntry = (entry: unknown) => {
  const entryType = Array.isArray(entry) ? "array" : typeof entry;
  const adjuster = adjusterMap[entryType];
  return adjuster?.(entry) || entry;
};
