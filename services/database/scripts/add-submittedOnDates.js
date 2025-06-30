/* eslint-disable no-console */
/*
 * Local:
 *    DYNAMODB_URL="http://localhost:8000" S3_LOCAL_ENDPOINT="http://localhost:4569" node services/database/scripts/add-submittedOnDates.js {{reportType}}
 *  Branch:
 *    branchPrefix="YOUR BRANCH NAME" node services/database/scripts/add-submittedOnDates.js {{reportType}}
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");
const { buildS3Client, list } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "local" : process.env.branchPrefix;
const reportType = process.argv[2] || "mcpar";
const tableName = `${branch}-${reportType}-reports`;
const bucketName = isLocal
  ? `local-${reportType}-form`
  : `database-${branch}-${reportType}`;

async function handler() {
  try {
    console.log("\n== Fetching report ==\n");

    const reports = await getDbItems();

    if (reports.length < 1) {
      console.log(`\n== No reports need updating in table ${tableName} ==\n`);
      return;
    } else {
      console.log(
        `\n== Found ${reports.length} report(s) needing updates in table ${tableName} ==\n`
      );
    }

    await updateDbItems(reports);

    return {
      statusCode: 200,
      body: "All done!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
}

async function getDbItems() {
  buildDynamoClient();
  const items = await scan({ TableName: tableName });
  const reports = filterDb(items);
  return reports;
}

function filterDb(items) {
  return items.filter(
    (item) =>
      item.submittedOnDate &&
      (!item.submittedOnDates || item.submittedOnDates.length < 1)
  );
}

async function updateDbItems(reports) {
  buildS3Client();

  const transformedItems = await Promise.all(
    reports.map(async (report) => {
      const { id, previousRevisions, state, submissionCount, submittedOnDate } =
        report;
      let submittedOnDates = [submittedOnDate];

      if (
        previousRevisions.length > 0 &&
        previousRevisions.length !== submissionCount
      ) {
        const allObjects = await list({
          Bucket: bucketName,
          Prefix: `fieldData/${state}`,
        });
        const fieldDataObjects = filterS3(allObjects, previousRevisions);

        if (fieldDataObjects.length > 0) {
          const fieldSubmittedDates = fieldDataObjects.map((obj) =>
            new Date(obj.LastModified).getTime()
          );
          submittedOnDates = [...fieldSubmittedDates, submittedOnDate];
        } else {
          console.log(`\n== No S3 objects found for ${id} ==\n`);
        }
      }

      return {
        ...report,
        submittedOnDates,
      };
    })
  );

  await update(tableName, transformedItems);
  console.log(
    `\n== Touched ${transformedItems.length} report(s) in table ${tableName} ==\n`
  );
}

function filterS3(bucketObjects, fieldDataIds) {
  return bucketObjects.filter((obj) => {
    // Key is in fieldData/state/uuid.json format, extract uuid
    const key = obj.Key.split("/");
    const keyId = key[key.length - 1].split(".")[0];

    return fieldDataIds.includes(keyId);
  });
}

handler();
