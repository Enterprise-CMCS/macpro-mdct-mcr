import { Handler } from "aws-lambda";
import {
  formTemplateTableName,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import md5 from "md5";
import s3Lib, { getFormTemplateKey } from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import {
  FormTemplate,
  isDefined,
  ReportMetadata,
  SomeRequired,
  State,
} from "../../utils/types";
import { S3 } from "aws-sdk";
import * as path from "path";
import { isFulfilled } from "../../utils/types/promises";
import { logger } from "../../utils/logging";
import { getTemplateVersionByHash } from "../../utils/formTemplates/formTemplates";
const REPORT_TYPES = ["MCPAR", "MLR"] as const;

type S3ObjectRequired = SomeRequired<S3.Object, "Key" | "LastModified">;

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
  })) as string;
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
  // Make sure we only grab old form templates
  return {
    id: path.basename(key).split(".")[0],
    hash,
    state: key.split("/")[1],
  };
}

/**
 * Create a distinct list of hashes.
 *
 * @param templates - list of { id, hash } objects
 * @returns distinct list
 */
export function getDistinctHashesForTemplates(
  templates: { id: string; hash: string; state: string }[]
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

  const formTemplates = await s3Lib.list({
    Bucket: reportBucket,
    Prefix: "formTemplates",
  });

  const sortedTemplates = formTemplates
    .filter((t): t is S3ObjectRequired => isDefined(t.LastModified))
    .sort((a, b) => b.LastModified.getTime() - a.LastModified.getTime())
    .filter((t) => t.Key?.endsWith(".json"));

  logger.info(
    `Found ${sortedTemplates.length} possible form template versions.`
  );

  /*
   * A note on type weirdness below. For some reason, the S3 provided type
   * S3.Object has the "Key" property as optional.
   *
   * The type-mangling below allows the array#filter function to
   */
  const processedTemplates = await Promise.allSettled(
    sortedTemplates
      .filter((t): t is S3ObjectRequired => {
        return isDefined(t.Key);
      })
      .filter((t) => t.Key.split("/")[1].length === 2)
      .map(async (template) => {
        const { id, hash, state } =
          (await processTemplate(reportBucket, template.Key)) ?? {};
        return {
          id,
          hash,
          state,
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
      md5Hash: x.hash,
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

  logger.info("Copying templates to new prefix location");
  await copyTemplatesToNewPrefix(reportBucket, distinctHashes);

  logger.info("Updating existing reports with new formTemplateIds");
  await updateExistingReports(reportType);
}

export async function copyTemplatesToNewPrefix(
  bucket: string,
  templates: { id: string; hash: string; state: string }[]
) {
  const templateKeys = templates.map((t) => {
    return { key: getFormTemplateKey(t.state as State, t.id), id: t.id };
  });
  for (const keyId of templateKeys) {
    const newKey = `formTemplates/${keyId.id}.json`;
    try {
      await s3Lib.copy({
        Bucket: bucket,
        CopySource: `${bucket}/${keyId.key}`,
        Key: newKey,
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

/**
 * Update all existing reports to be mapped to a version number.
 * Also, update the formTemplateId.
 *
 * @param reportType
 */
export async function updateExistingReports(
  reportType: typeof REPORT_TYPES[number]
) {
  const tableName = reportTables[reportType as keyof typeof reportTables];
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];
  const reports = (await (
    await dynamodbLib.scan({ TableName: tableName, reportType })
  ).Items) as ReportMetadata[];
  if (reports) {
    for (const report of reports) {
      if (report.formTemplateId) {
        const template = await getTemplate(
          reportBucket,
          getFormTemplateKey(report.state, report.formTemplateId)
        );
        const templateHash = md5(JSON.stringify(template));
        const templateVersion = await getTemplateVersionByHash(
          reportType,
          templateHash
        );
        if (templateVersion) {
          await dynamodbLib.put({
            TableName: tableName,
            Item: {
              ...report,
              versionNumber: templateVersion.Items?.[0]?.versionNumber,
              formTemplateId: templateVersion.Items?.[0]?.id,
            },
          });
        }
      }
    }
  }
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
    try {
      await processReport(reportType);
    } catch (err) {
      logger.error(err);
    }
  }
};
