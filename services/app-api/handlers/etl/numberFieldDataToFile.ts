/*To Do - Need to handle LastEvaluatedKey */
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, S3Put } from "../../utils/types";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { buckets } from "../../utils/constants/constants";

type FieldData = {
  fieldId: string;
  value: string;
};
type FieldTemplate = {
  fieldId: string;
  entityType?: string;
};
type S3Route = {
  state?: string;
  bucket: string;
  type: string;
};

const {
  MCPAR_REPORT_TABLE_NAME,
  MCPAR_FORM_BUCKET,
  MLR_REPORT_TABLE_NAME,
  MLR_FORM_BUCKET,
} = process.env;

const fileName = "numberValues";
const writeObject: any[] = [];

export const check = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  //extract and store mcpar data
  if (MCPAR_REPORT_TABLE_NAME && MCPAR_FORM_BUCKET) {
    await extractAndStoreData(MCPAR_REPORT_TABLE_NAME, MCPAR_FORM_BUCKET);
  }

  //extract and store mlr data
  if (MLR_REPORT_TABLE_NAME && MLR_FORM_BUCKET) {
    await extractAndStoreData(MLR_REPORT_TABLE_NAME, MLR_FORM_BUCKET);
  }

  let writeRoute: S3Route = {
    bucket: MLR_FORM_BUCKET ? MLR_FORM_BUCKET : "",
    type: buckets.FIELD_DATA,
  };
  await writeDataToS3(writeObject, writeRoute);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished write test",
    }),
  };
};

export const extractAndStoreData = async (
  table: string,
  bucket: string,
  LastEvaluatedKey?: any
) => {
  let scannedResult = await scanTable(table, LastEvaluatedKey);
  let metadataResults = scannedResult.Items;
  if (metadataResults) {
    for (const metadata of metadataResults) {
      let data = metadata as AnyObject;
      let formRoute: S3Route = {
        state: data.state,
        bucket: bucket,
        type: buckets.FORM_TEMPLATE,
      };
      let fieldRoute: S3Route = {
        state: data.state,
        bucket: bucket,
        type: buckets.FIELD_DATA,
      };

      let formTemplate = await getDataFromS3(data.formTemplateId, formRoute);
      let fieldData = await getDataFromS3(data.fieldDataId, fieldRoute);

      let numericalData = extractNumericalData(formTemplate, fieldData);
      if (numericalData) {
        writeObject.push(numericalData);
      }
    }
  }

  //loop function again until LastEvaluatedKey is null
  if (scannedResult.LastEvaluatedKey) {
    extractAndStoreData(table, bucket, scannedResult.LastEvaluatedKey);
  }
};

export const extractNumericalData = (
  formTemplate: AnyObject,
  fieldData: AnyObject
) => {
  let numericFields: FieldTemplate[] = [];
  iterateOverNumericFields(formTemplate.routes, numericFields);

  let extractedFieldData: FieldData[] = [];

  numericFields.forEach((item) => {
    let fieldId = item.fieldId;
    fieldValueById(fieldData, fieldId, extractedFieldData);
  });

  return extractedFieldData;
};

function iterateOverNumericFields(formTemplateRoutes: any[], list: any[]) {
  for (let route of formTemplateRoutes) {
    for (let formType of ["form", "drawerForm", "modalForm"]) {
      if (route[formType] && route[formType].fields) {
        for (let field of route[formType].fields) {
          if (field.validation === "number") {
            list.push({ fieldId: field.id, entityType: route.entity });
          }
        }
      }
    }
    if (route.children) {
      iterateOverNumericFields(route.children, list);
    }
  }
}

function fieldValueById(fieldData: any, fieldId: string, list: any[]) {
  Object.keys(fieldData).forEach((key) => {
    if (key === fieldId) {
      list.push({ [fieldId]: fieldData[key] });
    } else {
      if (fieldData[key] && typeof fieldData[key] === "object") {
        fieldValueById(fieldData[key], fieldId, list);
      }
    }
  });
}

//extract field data from s3 bucket
export const getDataFromS3 = async (id: string, route: S3Route) => {
  const dataParams: S3Get = {
    Bucket: route.bucket,
    Key: `${route.type}/${route.state}/${id}.json`,
  };
  return (await s3Lib.get(dataParams)) as AnyObject;
};

//load field data back to s3 bucket
export const writeDataToS3 = async (data: any, route: S3Route) => {
  const dataParams: S3Put = {
    Bucket: route.bucket,
    Key: `${route.type}/${fileName}.json`,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };
  const result = await s3Lib.put(dataParams);
  // eslint-disable-next-line no-console
  console.log("Updated form template ", {
    key: dataParams.Key,
    result,
  });

  return result;
};

//scan dynamodb table and return data
export const scanTable = async (TableName: string, LastEvaluatedKey?: any) => {
  let scanResult;
  try {
    scanResult = await dynamodbLib.scan({
      TableName,
      LastEvaluatedKey,
    });

    if (!scanResult || !scanResult.Items) {
      throw new Error("Scan result was undefined, or did not contain items!");
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Database scan failed for the table ${TableName}
                       with LastEvaluatedKey ${LastEvaluatedKey}.
                       Error: ${err}`);
    throw err;
  }
  return scanResult;
};
