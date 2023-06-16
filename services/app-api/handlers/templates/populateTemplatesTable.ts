import { Handler } from "aws-lambda";
import { AnyObject } from "yup/lib/types";
import {
  formTemplateTableName,
  reportBuckets,
} from "../../utils/constants/constants";
import md5 from "md5";
import s3Lib from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { FormTemplate } from "../../utils/types";
import { S3 } from "aws-sdk";
import * as path from "path";
import { isFulfilled } from "../../utils/types/promises";
import { logger } from "../../utils/logging";
const REPORT_TYPES = ["MCPAR", "MLR"] as const;

/**
 * Retrieve template data from S3
 *
 * @param bucket s3 bucket
 * @param key s3 key
 * @returns s3 object body
 */
export async function getTemplate(bucket: string, key: string) {
  return (await s3Lib.get({
    Key: key,
    Bucket: bucket,
  })) as AnyObject;
}

/**
 * Process a single form template, returning the form id and hash.
 *
 * @param bucket s3 bucket
 * @param key s3 key
 * @returns
 */
export async function processTemplate(bucket: string, key: string) {
  const formTemplate = await getTemplate(bucket, key);
  const hash = md5(JSON.stringify(formTemplate));
  return {
    id: path.basename(key).split(".")[0],
    hash,
  };
}

/**
 * Create a distinct list of hashes.
 *
 * @param templates - list of { id, hash } objects
 * @returns distinct list
 */
export function getDistinctHashesForTemplates(
  templates: { id: string; hash: string }[]
) {
  return templates.filter(
    (e, i) => templates.findIndex((a) => a["hash"] === e["hash"]) === i
  );
}

/**
 * Process a report type. This function retrieves all of the form templates in the database,
 * sorts them by creation date, and removes duplicates.
 * Each remaining form template becomes a new form version.
 *
 * @param reportType
 */
export async function processReport(reportType: typeof REPORT_TYPES[number]) {
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];
  const formTemplates = await s3Lib.list({ Bucket: reportBucket });

  logger.info(`Found ${formTemplates.length} possible form template versions.`);

  const sortedTemplates = formTemplates
    .sort(
      (a, b) =>
        (b.LastModified?.getDate() ?? 0) - (a.LastModified?.getDate() ?? 0)
    )
    .filter((a) => a.Key);

  /*
   * A note on type weirdness below. For some reason, the S3 provided type
   * S3.Object has the "Key" property as optional.
   *
   * The type-mangling below allows the array#filter function to
   */
  const processedTemplates = await Promise.allSettled(
    sortedTemplates
      .filter((t): t is Omit<S3.Object, "Key"> & { Key: string } => {
        return typeof t.Key !== "undefined";
      })
      .map(async (template) => {
        const { id, hash } =
          (await processTemplate(reportBucket, template.Key)) ?? {};
        return {
          id,
          hash,
        };
      })
  );

  const templatesAndHashes = processedTemplates
    .filter(isFulfilled)
    .map((template) => template.value);

  const distinctHashes = getDistinctHashesForTemplates(templatesAndHashes);

  logger.info(
    `Found ${distinctHashes.length} distinct templates after processing`
  );

  const dynamodbItems: FormTemplate[] = distinctHashes.map((x, index) => {
    return {
      id: x.id,
      versionNumber: index + 1,
      lastAltered: new Date().toISOString(),
      reportType,
    };
  });

  logger.info("Writing template versions to table");

  try {
    await Promise.all(
      dynamodbItems.map((item) =>
        dynamodbLib.put({ Item: item, TableName: formTemplateTableName })
      )
    );
  } catch (err: unknown) {
    logger.info(err);
    throw err;
  }

  logger.info(`Wrote ${dynamodbItems.length} template versions to the table`);
}

/**
 * This lambda function is used to populate a fresh DynamoDB table with
 * form template data.
 *
 * 1. Get all reports for a report type sorted oldest descending
 * 1. Get hash of each
 * 1. Each unique hash is a version
 * 1. Create new form template item with the first appearance of the version
 * as the canonical "template".
 * 1. Iterate version each time.
 */
export const handler: Handler<never, void> = async () => {
  for (const reportType of REPORT_TYPES) {
    logger.info(`Processing ${reportType} reports`);
    await processReport(reportType);
  }
};
