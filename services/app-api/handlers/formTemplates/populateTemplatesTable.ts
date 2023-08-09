import { Handler } from "aws-lambda";
import {
  formTemplateTableName,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import s3Lib from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import {
  FormTemplate,
  ReportJson,
  ReportMetadata,
  ReportType,
  SomeRequired,
} from "../../utils/types";
import { S3 } from "aws-sdk";
import * as path from "path";
import { logger } from "../../utils/logging";
import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import { createHash } from "crypto";

type S3ObjectRequired = SomeRequired<S3.Object, "Key" | "LastModified">;
const isS3ObjectRequired = (obj: S3.Object): obj is S3ObjectRequired => {
  return (
    typeof obj["Key"] !== "undefined" &&
    typeof obj["LastModified"] !== "undefined"
  );
};

type FormTemplateMetaData = {
  id: string;
  state?: string;
  key: string;
  hash: string;
};

/**
 *
 * @param reportType report type
 * @param hash hash to look for
 * @returns
 */
export function getTemplateVersionByHash(reportType: ReportType, hash: string) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "HashIndex",
    KeyConditionExpression: "reportType = :reportType AND md5Hash = :md5Hash",
    Limit: 1,
    ExpressionAttributeValues: {
      ":md5Hash": hash as AttributeValue,
      ":reportType": reportType as unknown as AttributeValue,
    },
  };
  return dynamodbLib.query(queryParams);
}

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
  })) as ReportJson;
}

/**
 * Process a single form template, returning the form id and hash.
 *
 * @param bucket s3 bucket
 * @param key s3 key
 * @returns
 */
export async function processTemplate(
  bucket: string,
  key: string
): Promise<FormTemplateMetaData> {
  const formTemplate = await getTemplate(bucket, key);
  const hash = createHash("md5")
    .update(JSON.stringify(formTemplate))
    .digest("hex");

  return {
    id: path.basename(key, ".json"),
    key,
    hash,
    state: key.split("/")[1],
  };
}

/**
 * Process a report type. This function retrieves all of the form templates in the database,
 * sorts them by creation date, and removes duplicates.
 * Each remaining form template becomes a new form version.
 *
 * @param reportType
 */
export async function processReportTemplates(reportType: ReportType) {
  const formTemplateBucket = reportBuckets[reportType];

  const formTemplates = await s3Lib.list({
    Bucket: formTemplateBucket,
    Prefix: "formTemplates",
  });

  const sortedTemplateKeys = formTemplates
    .filter(isS3ObjectRequired)
    .filter((t) => t.Key.endsWith(".json"))
    .filter((t) => !t.Key.includes("/undefined/")) // Include form templates in the root AND in state-specific folders, but not the weird "undefined" folder
    .sort((a, b) => a.LastModified.getTime() - b.LastModified.getTime())
    .map((t) => t.Key);

  logger.info(
    `Found ${sortedTemplateKeys.length} possible form template versions.`
  );

  /*
   * AWS types returned from the SDK have all attributes set to optional.
   * This code filters out any potential undefined keys and modifies the type
   * of the object.
   */
  const templatesAndHashes = await Promise.all(
    sortedTemplateKeys.map(
      async (key) => await processTemplate(formTemplateBucket, key)
    )
  );

  const formTemplateHashCache = new Map<string, string>(
    templatesAndHashes.map((t) => [t.id, t.hash])
  );

  const distinctHashes = templatesAndHashes.filter(
    (x, i, a) => i === a.findIndex((y) => y.hash === x.hash)
  );

  logger.info(
    `Found ${distinctHashes.length} distinct templates after processing`
  );

  const formTemplateDynamoEntries: FormTemplate[] = distinctHashes.map(
    (x, index) => {
      return {
        id: x.id,
        versionNumber: index + 1,
        lastAltered: new Date().toISOString(),
        md5Hash: x.hash,
        reportType,
      };
    }
  );

  const formTemplateVersionCache = new Map<string, FormTemplate>(
    formTemplateDynamoEntries.map((x) => [x.md5Hash, x])
  );

  logger.info("Writing template versions to table");

  try {
    for (const dynamoEntry of formTemplateDynamoEntries) {
      await dynamodbLib.put({
        Item: dynamoEntry,
        TableName: formTemplateTableName,
      });
    }
  } catch (err: unknown) {
    logger.info(err);
    throw err;
  }

  logger.info(
    `Wrote ${formTemplateDynamoEntries.length} template versions to the table`
  );

  logger.info("Copying templates to new prefix location");
  await copyTemplatesToNewPrefix(formTemplateBucket, distinctHashes);

  logger.info("Updating existing reports with new formTemplateIds");
  await updateExistingReports(
    reportType,
    formTemplateHashCache,
    formTemplateVersionCache
  );
}

export async function copyTemplatesToNewPrefix(
  bucket: string,
  templates: FormTemplateMetaData[]
) {
  for (const t of templates) {
    const oldKey = t.key;
    const newKey = `formTemplates/${t.id}.json`;
    try {
      await s3Lib.copy({
        Bucket: bucket,
        CopySource: `${bucket}/${oldKey}`,
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
  reportType: ReportType,
  formTemplateHashCache: Map<string, string>,
  formTemplateVersionCache: Map<string, FormTemplate>
) {
  const tableName = reportTables[reportType];
  const reports = (await dynamodbLib.scanAll({ TableName: tableName }))
    .Items as ReportMetadata[];

  if (reports) {
    for (const report of reports) {
      if (report.formTemplateId) {
        const templateHash = formTemplateHashCache.get(report.formTemplateId);
        if (!templateHash) {
          logger.info(
            `Skipping report ${report.id}; its form template hash was never computed (form template ID ${report.formTemplateId}, state ${report.state})`
          );
          continue;
        }
        const templateVersion = formTemplateVersionCache.get(templateHash);
        if (templateVersion) {
          await dynamodbLib.put({
            TableName: tableName,
            Item: {
              ...report,
              versionNumber: templateVersion.versionNumber,
              formTemplateId: templateVersion.id,
            },
          });
        } else {
          throw new Error(
            `Report ${report.id} has no formTemplateId and cannot be processed.`
          );
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
export const handler: Handler<never, void> = async (evt: any) => {
  logger.info("EVENT:", evt);

  const reportTypes = evt?.reportTypes ?? Object.values(ReportType);

  logger.info("Performing operation for reports:", reportTypes);
  for (const reportType of reportTypes) {
    logger.info(`Processing ${reportType} reports`);
    try {
      await processReportTemplates(reportType);
    } catch (err) {
      logger.error(err);
    }
  }
};
