/* eslint-disable no-console */
import { DynamoDB, S3 } from "aws-sdk";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import KSUID from "ksuid";

const TABLE_NAME = process.env.MCPAR_REPORT_TABLE_NAME!;
const BUCKET_NAME = process.env.MCPAR_FORM_BUCKET!;

let dynamoClient: any;
let s3Client: any;

export const handler = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  initialize();

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
      results.Items.forEach((report: any) => {
        const formTemplate = report.formTemplate;
        const fieldData = report.fieldData;
        if (!formTemplate || !fieldData) {
          console.error("Report doesn't have fieldData or formTemplate", {
            state: report.state,
            id: report.id,
          });
          return;
        }

        const formTemplateId = KSUID.randomSync().string;
        const fieldDataId = KSUID.randomSync().string;

        writeToS3("formTemplates", report.state, formTemplateId, formTemplate);
        writeToS3("fieldData", report.state, fieldDataId, fieldData);

        //Write new format back into DynamoDB
        delete report.formTemplate;
        delete report.fieldData;
        report.formTemplateId = formTemplateId;
        report.fieldDataId = fieldDataId;

        writeItemToDb(report);
      });
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

const writeToS3 = async (
  directory: string,
  state: string,
  name: string,
  data: any
) => {
  const bucketParams = {
    Bucket: BUCKET_NAME,
    Key: `${directory}/${state}/${name}.json`,
    Body: JSON.stringify(data),
  };

  console.debug(`Writing to S3 ${bucketParams.Bucket}/${bucketParams.Key}`);
  await new Promise<void>((resolve, reject) => {
    s3Client.putObject(bucketParams, function (err: any, result: any) {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      }
    });
  });
};

const writeItemToDb = async (item: any) => {
  console.log("Writing changes to table: ", TABLE_NAME);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...item,
    },
    ReturnValues: "ALL_OLD",
  };
  try {
    await dynamoClient.put(params).promise();
    console.log(`Updated: ${item.state} - ${item.id}`);
  } catch (e) {
    console.error("error", e);
  }
};

const initialize = () => {
  const ddbConfig: any = {};
  const s3Config: any = {};
  const ddbEndpoint = process.env.DYNAMODB_URL;
  const s3Endpoint = process.env.S3_LOCAL_ENDPOINT;
  if (ddbEndpoint) {
    ddbConfig.endpoint = ddbEndpoint;
    ddbConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    ddbConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
  } else {
    ddbConfig.region = "us-east-1";
  }
  dynamoClient = new DynamoDB.DocumentClient(ddbConfig);

  if (s3Endpoint) {
    s3Config.endpoint = s3Endpoint;
    s3Config.region = "localhost";
    s3Config.s3ForcePathStyle = true;
    s3Config.accessKeyId = "S3RVER"; // pragma: allowlist secret
    s3Config.secretAccessKey = "S3RVER"; // pragma: allowlist secret
  } else {
    s3Config.region = "us-east-1";
  }
  console.log({ s3Config });
  s3Client = new S3(s3Config);
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
