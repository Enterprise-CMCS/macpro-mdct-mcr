const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

let dynamoClient;

const buildDynamoClient = () => {
  const dynamoConfig = {
    logger: {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    },
  };
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    dynamoConfig.endpoint = endpoint;
    dynamoConfig.region = "localhost";
    dynamoConfig.credentials = {
      accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
      secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
    };
  } else {
    dynamoConfig["region"] = "us-east-1";
  }

  const bareBonesClient = new DynamoDBClient(dynamoConfig);
  dynamoClient = DynamoDBDocumentClient.from(bareBonesClient);
};

const scan = async (scanParams) => {
  let ExclusiveStartKey;
  const items = [];

  do {
    const command = new ScanCommand({ ...scanParams, ExclusiveStartKey });
    const result = await dynamoClient.send(command);
    items.push(...(result.Items ?? []));
    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return items;
};

const update = async (tableName, items) => {
  try {
    for (const item of items) {
      const params = {
        TableName: tableName,
        Item: {
          ...item,
        },
      };

      const command = new PutCommand(params);
      await dynamoClient.send(command);
    }
  } catch (error) {
    console.log(` -- ERROR UPLOADING ${tableName}\n`, error);
  }
};

module.exports = { buildDynamoClient, scan, update };
