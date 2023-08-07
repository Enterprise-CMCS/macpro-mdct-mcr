import { Handler } from "aws-lambda";
import {
  buckets,
  formTemplateTableName,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import s3Lib, { getFormTemplateKey } from "../../utils/s3/s3-lib";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import {
  FormTemplate,
  ReportJson,
  ReportMetadata,
  ReportType,
  SomeRequired,
  State,
} from "../../utils/types";
import { S3 } from "aws-sdk";
import * as path from "path";
import { logger } from "../../utils/logging";
import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import { createHash } from "crypto";
import { copyAdminDisabledStatusToForms } from "../../utils/formTemplates/formTemplates";

type S3ObjectRequired = SomeRequired<S3.Object, "Key" | "LastModified">;
const isS3ObjectRequired = (obj: S3.Object): obj is S3ObjectRequired => {
  return (
    typeof obj["Key"] !== "undefined" &&
    typeof obj["LastModified"] !== "undefined"
  );
};

function getStateSpecificFormTemplateKey(formTemplateId: string, state: State) {
  return `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`;
}

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
export async function processTemplate(bucket: string, key: string) {
  const formTemplate = await getTemplate(bucket, key);
  const hash = createHash("md5")
    .update(JSON.stringify(copyAdminDisabledStatusToForms(formTemplate)))
    .digest("hex");
  // Make sure we only grab old form templates
  return {
    id: path.basename(key, ".json"),
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
    .filter((t) => t.Key.split("/")[1].length === 2) // subfolder is a state abbreviation
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
  await updateExistingReports(reportType);
}

export async function copyTemplatesToNewPrefix(
  bucket: string,
  templates: { id: string; hash: string; state: string }[]
) {
  for (const t of templates) {
    const oldKey = getStateSpecificFormTemplateKey(t.id, t.state as State);
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
 * If any reports are created in between the deployment of the API
 * and the execution of this script, those reports will not have
 * a state-specific bucket key. So get them from the parent directory.
 */
async function getTemplateThatIsProbablyStateSpecific(
  reportBucket: string,
  report: ReportMetadata
) {
  try {
    return await getTemplate(
      reportBucket,
      getStateSpecificFormTemplateKey(report.formTemplateId, report.state)
    );
  } catch {
    return await getTemplate(
      reportBucket,
      getFormTemplateKey(report.formTemplateId)
    );
  }
}

/**
 * Update all existing reports to be mapped to a version number.
 * Also, update the formTemplateId.
 *
 * @param reportType
 */
export async function updateExistingReports(reportType: ReportType) {
  const tableName = reportTables[reportType];
  const reportBucket = reportBuckets[reportType];
  const reports = (await dynamodbLib.scanAll({ TableName: tableName }))
    .Items as ReportMetadata[];

  if (reports) {
    for (const report of reports) {
      if (report.formTemplateId) {
        const template = await getTemplateThatIsProbablyStateSpecific(
          reportBucket,
          report
        );
        const templateHash = createHash("md5")
          .update(JSON.stringify(copyAdminDisabledStatusToForms(template)))
          .digest("hex");
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
export const handler: Handler<never, void> = async () => {
  for (const reportType of Object.values(ReportType)) {
    logger.info(`Processing ${reportType} reports`);
    try {
      await processReportTemplates(reportType);
    } catch (err) {
      logger.error(err);
    }
  }
};
