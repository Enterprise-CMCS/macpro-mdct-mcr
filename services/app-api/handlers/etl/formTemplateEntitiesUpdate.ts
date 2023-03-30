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
  console.log("Performing ETL with params", { TABLE_NAME, BUCKET_NAME });
  await recursiveTransform();
  console.log("Finished Processing");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished ETL script",
    }),
  };
};

export const recursiveTransform = async (startingKey: any = undefined) => {
  try {
    let scannedResult = await scanTableForMetadata(TABLE_NAME, startingKey);
    let metadataResults = scannedResult.results;
    console.log("Iterating over fetched items:", {
      startingKey,
      recordCount: metadataResults?.Items?.length,
    });
    if (metadataResults?.Items) {
      for (const metadata of metadataResults.Items) {
        await processMetadata(metadata as AnyObject);
      }
    }
    if (scannedResult.startingKey) {
      await recursiveTransform(scannedResult.startingKey);
    } else {
      console.log("Starting key is ", scannedResult.startingKey);
      return;
    }
  } catch (err) {
    console.error(`Database scan failed for the table ${TABLE_NAME}
                   with startingKey ${startingKey}.
                   Error: ${err}`);
    throw err;
  }
};

export const processMetadata = async (metadata: AnyObject) => {
  let formTemplateId = metadata.formTemplateId;
  let reportState = metadata.state;
  if (!formTemplateId) {
    console.error("Could not find formTemplateId", {
      state: metadata.state,
      id: metadata.id,
    });
    return;
  }
  console.log("Processing report", {
    id: metadata.id,
    formTemplateId,
    reportState,
  });

  // get formTemplate with formTemplateID
  const formTemplate = await getFormTemplateFromS3(formTemplateId, reportState);
  if (!formTemplate.entities) {
    // modify formTemplate > write to s3
    const updatedFormTemplate = Object.assign(
      formTemplate,
      ENTITIES_UPDATE_DATA
    );
    await writeFormTemplateToS3(
      updatedFormTemplate,
      formTemplateId,
      reportState
    );
  }
};

export const scanTableForMetadata = async (
  tableName: string,
  startingKey?: any
) => {
  let results = await dynamodbLib.scan({
    TableName: tableName,
    ExclusiveStartKey: startingKey,
  });
  return { startingKey: results?.LastEvaluatedKey, results };
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

export const writeFormTemplateToS3 = async (
  formTemplate: any,
  formId: string,
  reportState: string
) => {
  const formTemplateParams: S3Put = {
    Bucket: BUCKET_NAME,
    Key: `${buckets.FORM_TEMPLATE}/${reportState}/${formId}.json`,
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
