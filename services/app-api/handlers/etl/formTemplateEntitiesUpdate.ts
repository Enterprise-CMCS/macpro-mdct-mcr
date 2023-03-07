/* eslint-disable no-console */
import { DynamoDB } from "aws-sdk";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, S3Put } from "../../utils/types/types";
import { buckets } from "../../utils/constants/constants";

const TABLE_NAME = process.env.MCPAR_REPORT_TABLE_NAME!;
const BUCKET_NAME = process.env.MCPAR_FORM_BUCKET!;

const ENTITIES_UPDATE_DATA = {
  entities: {
    sanctions: { required: false },
    accessMeasures: { required: true },
    qualityMeasures: { required: true },
    plans: { required: true },
    bssEntities: { required: true },
  },
};

let dynamoClient: any;

export const transform = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  console.log("Starting Lambda");
  initialize();
  let keepSearching = true;
  let startingKey;

  let metadataResults;

  while (keepSearching) {
    try {
      [startingKey, keepSearching, metadataResults] =
        await scanTableForMetadata(TABLE_NAME, keepSearching, startingKey);
      console.log({ metadataResults });
      // get formTemplateId from metadata
      for (const metadata of metadataResults.Items) {
        let formTemplateId = metadata.formTemplateId;
        if (!formTemplateId) {
          console.error("Could not find formTemplateId", {
            state: metadata.state,
            id: metadata.id,
          });
          continue;
        }

        // get formTemplate with formTemplateID
        const formTemplate = await getFormTemplateFromS3(
          formTemplateId,
          metadata.state
        );
        console.log({ entities: formTemplate.entities });

        // modify formTemplate > write to s3
        const updatedFormTemplate = await updateFormTemplate(formTemplate);

        console.log({ entities: updatedFormTemplate.entities });

        const formTemplateParams: S3Put = {
          Bucket: BUCKET_NAME,
          Key: `${buckets.FORM_TEMPLATE}/${metadata.state}/${formTemplateId}.json`,
          Body: JSON.stringify(updatedFormTemplate),
          ContentType: "application/json",
        };
        await s3Lib.put(formTemplateParams);
      }
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
      message: "finished ETL script",
    }),
  };
};

export const initialize = () => {
  const ddbConfig: any = {};
  const ddbEndpoint = process.env.DYNAMODB_URL;

  // connect to DB
  if (ddbEndpoint) {
    ddbConfig.endpoint = ddbEndpoint;
    ddbConfig.accessKeyId = "LOCAL_FAKE_KEY"; // pragma: allowlist secret
    ddbConfig.secretAccessKey = "LOCAL_FAKE_SECRET"; // pragma: allowlist secret
  } else {
    ddbConfig.region = "us-east-1";
  }
  dynamoClient = new DynamoDB.DocumentClient(ddbConfig);
};

export const scanTableForMetadata = async (
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

export const getFormTemplateFromS3 = async (
  formTemplateId: string,
  state: string
) => {
  const formTemplateParams: S3Get = {
    Bucket: BUCKET_NAME,
    Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
  };
  return (await s3Lib.get(formTemplateParams)) as AnyObject;
};

export const updateFormTemplate = async (formTemplate: any) => {
  Object.assign(formTemplate, ENTITIES_UPDATE_DATA);
  return formTemplate;
};
