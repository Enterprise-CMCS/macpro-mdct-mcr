/*To Do - Expand to MLR, - Need to handle LastEvaluatedKey */

import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import s3Lib from "../../utils/s3/s3-lib";
import { AnyObject, S3Get, S3Put } from "../../utils/types";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { buckets } from "../../utils/constants/constants";

const TABLE_NAME = process.env.MCPAR_REPORT_TABLE_NAME!;
const BUCKET = process.env.MCPAR_FORM_BUCKET!;

type FieldData = {
  fieldId: string;
  value: string;
};
type FieldTemplate = {
  fieldId: string;
  entityType?: string;
};

const fileName = "numberValues";
const writeObject: any[] = [];

export const run = async (
  _event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  let scannedResult = await scanTable(TABLE_NAME);
  let metadataResults = scannedResult.Items;
  if (metadataResults) {
    for (const metadata of metadataResults) {
      let state = (metadata as AnyObject).state;

      let formTemplateId = (metadata as AnyObject).formTemplateId;
      let formType = buckets.FORM_TEMPLATE;
      let formTemplate = await getDataFromS3(
        formTemplateId,
        state,
        BUCKET,
        formType
      );

      let fieldDataId = (metadata as AnyObject).fieldDataId;
      let fieldType = buckets.FIELD_DATA;
      let fieldData = await getDataFromS3(
        fieldDataId,
        state,
        BUCKET,
        fieldType
      );

      let numericalData = extractNumericalData(formTemplate, fieldData);
      if (numericalData) {
        writeObject.push(numericalData);
      }
    }
  }

  await writeDataToS3(writeObject, BUCKET, buckets.FIELD_DATA);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "finished write test",
    }),
  };
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
export const getDataFromS3 = async (
  dataId: string,
  state: string,
  bucket: string,
  bucketType: string
) => {
  const dataParams: S3Get = {
    Bucket: bucket,
    Key: `${bucketType}/${state}/${dataId}.json`,
  };
  return (await s3Lib.get(dataParams)) as AnyObject;
};

//load field data back to s3 bucket
export const writeDataToS3 = async (
  data: any,
  bucket: string,
  bucketType: string
) => {
  const dataParams: S3Put = {
    Bucket: bucket,
    Key: `${bucketType}/${fileName}.json`,
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
export const scanTable = async (TableName: string) => {
  let ExclusiveStartKey;
  let scanResult;
  try {
    scanResult = await dynamodbLib.scan({
      TableName,
      ExclusiveStartKey,
    });

    if (!scanResult || !scanResult.Items) {
      throw new Error("Scan result was undefined, or did not contain items!");
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Database scan failed for the table ${TableName}
                       with ExclusiveStartKey ${ExclusiveStartKey}.
                       Error: ${err}`);
    throw err;
  }
  return scanResult;
};
