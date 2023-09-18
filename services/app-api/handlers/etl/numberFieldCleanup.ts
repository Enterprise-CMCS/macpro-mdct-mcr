/* eslint-disable no-console */
import { APIGatewayProxyResult } from "aws-lambda";
import { reportBuckets } from "../../utils/constants/constants";
import s3Lib, { getFieldDataKey } from "../../utils/s3/s3-lib";
import { AnyObject, ReportMetadata, ReportType } from "../../utils/types/index";
import {
  ExtractResult,
  FieldData,
  isExtractResultArray,
} from "./numberFieldValueCategorization";

/*
 * Number Field Cleanup
 * --------------------
 * This script is a follow-up to numberFieldDataToFile.ts. That script gathers
 * data from existing reports, to find any values in number fields which would
 * not pass our newer, stricter validation rules. This script goes in and fixes
 * those values, where a fix is possible.
 *
 * This ETL was run once, in each environment, in late Aug / early Sept, 2023.
 * There should be no need to run it ever again, but it may still be useful as
 * an example of a working ETL.
 */

/**
 * This function is exposed as a lambda via the serverless.yml file.
 * Its input should be the output of numberFieldDataToFile.ts.
 */
export const cleanupNumericData = async (
  extractResults: any
): Promise<APIGatewayProxyResult> => {
  try {
    if (!isExtractResultArray(extractResults)) {
      throw new Error("Lambda event parameter is not an ExtractResult array!");
    }

    await doCleanup(extractResults);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Cleanup complete",
      }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};

/**
 * This function does the work.
 */
export const doCleanup = async (extractResults: ExtractResult[]) => {
  for (const result of extractResults) {
    const fixableFields = result.fields.filter((f) => f.level === "fixable");
    if (fixableFields.length > 0) {
      const reportData = await fetchReport(result.report);
      for (const field of fixableFields) {
        let value = getValue(reportData, field);
        value = cleanValue(value);
        setValue(reportData, field, value);
      }
      await putReport(result.report, reportData);
    }
  }
};

/**
 * Pull a specific field's value from the report data
 */
const getValue = (reportData: AnyObject, field: FieldData) => {
  if (field.entityType) {
    return reportData[field.entityType][field.index][field.fieldId];
  } else {
    return reportData[field.fieldId];
  }
};

/**
 * Transform this value to one that will pass strict validation
 */
const cleanValue = (value: string) => {
  // Only negative signs, digits, decimal points, and colons may remain
  let cleaned = value.replaceAll(/[^\-\d.:]/g, "");
  if (cleaned.startsWith(".")) {
    // If the value is less than one with no leading zero, add it.
    cleaned = "0" + cleaned;
  }
  return cleaned;
};

/**
 * Set a specific field's value in the report data
 */
const setValue = (reportData: AnyObject, field: FieldData, value: string) => {
  if (field.entityType) {
    reportData[field.entityType][field.index][field.fieldId] = value;
  } else {
    reportData[field.fieldId] = value;
  }
};

const fetchReport = async (reportMetadata: ReportMetadata) => {
  return (await s3Lib.get({
    Bucket: reportBuckets[reportMetadata.reportType as ReportType],
    Key: getFieldDataKey(reportMetadata.state, reportMetadata.fieldDataId),
  })) as AnyObject;
};

const putReport = async (
  reportMetadata: ReportMetadata,
  reportData: AnyObject
) => {
  await s3Lib.put({
    Bucket: reportBuckets[reportMetadata.reportType as ReportType],
    Key: getFieldDataKey(reportMetadata.state, reportMetadata.fieldDataId),
    Body: JSON.stringify(reportData),
    ContentType: "application/json",
  });
};
