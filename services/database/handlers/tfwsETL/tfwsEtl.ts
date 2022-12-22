/* eslint-disable no-console */
/* eslint-disable */
import { DynamoDB, S3 } from "aws-sdk";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

const TABLE_NAME = process.env.MCPAR_REPORT_TABLE_NAME!;
//const BUCKET_NAME = process.env.MCPAR_FORM_BUCKET!;

let dynamoClient: any;
let s3Client: any;

export const handler = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  initialize();

  // READ EXISTING DYNAMODB DATA
  let keepSearching = true;
  let startingKey;

  let results;
  while (keepSearching) {
    try {
      [startingKey, keepSearching, results] = await scanTable(
        TABLE_NAME,
        keepSearching,
        startingKey
      );
      results.Items.forEach((item: { Key: any }) => console.log(item.Key));
      console.log(`results`);
    } catch (err) {
      console.error(`Database scan failed for the table ${TABLE_NAME}
                     with startingKey ${startingKey} and the keepSearching flag is ${keepSearching}.
                     Error: ${err}`);
      throw err;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished TFWS ETL script",
    }),
  };
};

const initialize = () => {
  const awsConfig: any = {};
  const endpoint = process.env.DYNAMODB_URL;
  if (endpoint) {
    awsConfig.endpoint = endpoint;
    awsConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    awsConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
  } else {
    awsConfig["region"] = "us-east-1";
  }
  dynamoClient = new DynamoDB.DocumentClient(awsConfig);
  s3Client = new S3(awsConfig);
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
