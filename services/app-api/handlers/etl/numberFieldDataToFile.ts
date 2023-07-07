import { Context, APIGatewayEvent } from "aws-lambda";
import s3Lib from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { AnyObject, StatusCodes, S3Get, S3Put } from "../../utils/types";
import { buckets } from "../../utils/constants/constants";

const { MCPAR_REPORT_TABLE_NAME, MCPAR_FORM_BUCKET } = process.env;
const { FORM_TEMPLATE, FIELD_DATA } = buckets;
type FieldData = {
  fieldId: string;
  value: string;
};
type ReportMetadata = {
  id: string;
  state: string;
  formTemplateId: string;
  fieldDataId: string;
};
type FieldTemplate = {
  fieldId: string;
  entityType?: string;
};

let extractedFieldData: FieldData[] = [];
const fileName = "numberValues";

export const check = async (_event: APIGatewayEvent, _context: Context) => {
  if (
    MCPAR_REPORT_TABLE_NAME === undefined ||
    !MCPAR_REPORT_TABLE_NAME.length ||
    MCPAR_FORM_BUCKET === undefined ||
    !MCPAR_FORM_BUCKET.length
  ) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: "Could not read environment variables MCPAR_REPORT_TABLE_NAME and/or MCPAR_FORM_BUCKET",
    };
  }

  iterateOverDynamoEntries<ReportMetadata>(
    MCPAR_REPORT_TABLE_NAME,
    (reportMetadata) => attemptValidationOnReport(reportMetadata)
  );

  return {
    status: StatusCodes.SUCCESS,
    body: JSON.stringify({
      message: "finished pulling number field data",
    }),
  };
};

async function attemptValidationOnReport(metadata: ReportMetadata) {
  const { id, state, formTemplateId, fieldDataId } = metadata;
  if (!formTemplateId) {
    // eslint-disable-next-line no-console
    console.error("Metadata did not contain a formTemplateId", { state, id });
    return;
  }

  const formTemplate = (await s3Lib.get({
    Bucket: MCPAR_FORM_BUCKET!,
    Key: `${FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
  })) as AnyObject;
  const fieldData = await s3Lib.get({
    Bucket: MCPAR_FORM_BUCKET!,
    Key: `${FIELD_DATA}/${state}/${fieldDataId}.json`,
  });

  iterateOverNumericFields(
    formTemplate.routes,
    (fieldTemplate: FieldTemplate) =>
      extractFieldValue(fieldData, fieldTemplate)
  );

  await writeDataToS3(extractedFieldData, MCPAR_FORM_BUCKET!, FIELD_DATA);

  let data = await getDataFromS3(MCPAR_FORM_BUCKET!, buckets.FIELD_DATA);
  if (data) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
  }
  // eslint-disable-next-line no-console
  else console.log("No data found");
}

function iterateOverNumericFields(
  formTemplateRoutes: any[],
  callback: (fieldTemplate: FieldTemplate) => void
) {
  for (let route of formTemplateRoutes) {
    for (let formType of ["form", "drawerForm", "modalForm"]) {
      if (route[formType] && route[formType].fields) {
        for (let field of route[formType].fields) {
          if (field.validation === "number") {
            callback({ fieldId: field.id, entityType: route.entity });
          }
        }
      }
    }
    if (route.children) {
      iterateOverNumericFields(route.children, callback);
    }
  }
}

function fieldValueById(fieldData: any, fieldId: string) {
  let data = "";

  Object.keys(fieldData).forEach((key) => {
    if (data === "") {
      if (key === fieldId) {
        data = fieldData[key];
      } else {
        if (fieldData[key] && typeof fieldData[key] === "object") {
          data = fieldValueById(fieldData[key], fieldId);
        }
      }
    }
  });

  return data;
}

function extractFieldValue(fieldData: any, fieldTemplate: FieldTemplate) {
  let { fieldId } = fieldTemplate;
  let value = fieldValueById(fieldData, fieldId);
  extractedFieldData.push({ fieldId, value });
}

async function iterateOverDynamoEntries<T>(
  TableName: string,
  callback: (item: T) => void
) {
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
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

    for (let item of scanResult.Items) {
      callback(item as T);
    }

    if (scanResult.LastEvaluatedKey) {
      ExclusiveStartKey = scanResult.LastEvaluatedKey;
    } else {
      break;
    }
  }
}

//extract field data from s3 bucket
export const getDataFromS3 = async (bucket: string, bucketType: string) => {
  const dataParams: S3Get = {
    Bucket: bucket,
    Key: `${bucketType}/${fileName}.json`,
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
