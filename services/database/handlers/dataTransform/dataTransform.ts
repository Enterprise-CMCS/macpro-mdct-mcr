import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

let UPDATE_ARCHIVED = false;
let UPDATE_SUBMITTED = false;
let BAD_VALUE = "DO NOT TOUCH";
let GOOD_VALUE = "NEW PROGRAM NAME";

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
    itemsToChange = filterItemsMatchingCondition(itemsToChange);

    console.log({ itemsToChange });

    // TRANSFORM DATA
    const updatedItems = itemsToChange.map((item: any) => {
      item.programName = GOOD_VALUE;
      return item;
    });
    console.log({ updatedItems });

    // UPLOAD BACK TO DYNAMODB
    writeItemsToDb(updatedItems, tableName, dynamoClient);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello world",
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
    // item.programName !== BAD_VALUE
    console.log("typeof formtemplate", typeof item.formTemplate);
    const stringTemplate = JSON.stringify(item.formTemplate);
    const indexOfText = stringTemplate.indexOf(
      "Enter the total, unduplicated number of individuals enrolled in any type of Medicaid managed care as of the first day of the last month of the reporting year."
    );
    console.log({ indexOfText });
    stringTemplate.replace(
      "Enter the total, unduplicated number of individuals enrolled in any type of Medicaid managed care as of the first day of the last month of the reporting year.",
      "HAHAHAHAHAHAH WIN!"
    );
    console.log("parse", JSON.parse(stringTemplate));
    item.formTemplate = JSON.parse(stringTemplate);
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
