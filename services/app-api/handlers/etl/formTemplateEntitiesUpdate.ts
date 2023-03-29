/* eslint-disable no-console */
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import s3Lib from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
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

export const transform = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  let keepSearching = true;
  let startingKey;
  let metadataResults;
  console.log("Performing ETL with params", { TABLE_NAME, BUCKET_NAME });
  while (keepSearching) {
    try {
      [startingKey, keepSearching, metadataResults] =
        await scanTableForMetadata(TABLE_NAME, keepSearching, startingKey);
      console.log("Iterating over fetched items:", {
        startingKey,
        keepSearching,
        recordCount: metadataResults?.Items.length,
      });
      if (metadataResults?.Items) {
        for (const metadata of metadataResults.Items) {
          console.log("Processing",metadata)
          await processMetadata(metadata);
        }
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

export const processMetadata = async (metadata: AnyObject) => {
  let formTemplateId = metadata.formTemplateId;
  if (!formTemplateId) {
    console.error("Could not find formTemplateId", {
      state: metadata.state,
      id: metadata.id,
    });
    return;
  }

  // get formTemplate with formTemplateID
  const formTemplate = await getFormTemplateFromS3(
    formTemplateId,
    metadata.state
  );
  if (!formTemplate.entities) {
    // modify formTemplate > write to s3
    const updatedFormTemplate = Object.assign(
      formTemplate,
      ENTITIES_UPDATE_DATA
    );
    await writeFormTemplateToS3(updatedFormTemplate);
  }
};

export const scanTableForMetadata = async (
  tableName: string,
  keepSearching: boolean,
  startingKey?: any
) => {
  let results = await dynamodbLib.scan({
    TableName: tableName,
    ExclusiveStartKey: startingKey,
  });
  if (results && results.LastEvaluatedKey) {
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
  // try {
  const formTemplateParams: S3Get = {
    Bucket: BUCKET_NAME,
    Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
  };
  return (await s3Lib.get(formTemplateParams)) as AnyObject;
};

export const writeFormTemplateToS3 = async (formTemplate: any) => {
  const formTemplateParams: S3Put = {
    Bucket: BUCKET_NAME,
    Key: `${buckets.FORM_TEMPLATE}/${formTemplate.state}/${formTemplate.id}.json`,
    Body: JSON.stringify(formTemplate),
    ContentType: "application/json",
  };
  const result = await s3Lib.put(formTemplateParams);
  console.log("Updated form template ", {
    key: formTemplateParams.Key,
    result,
  });

  return result;
};
