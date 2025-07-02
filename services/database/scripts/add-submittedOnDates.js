/* eslint-disable no-console */
/*
 * Local:
 *   DYNAMODB_URL="http://localhost:8000" S3_LOCAL_ENDPOINT="http://localhost:4569" node services/database/scripts/add-submittedOnDates.js {{reportType}}
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/add-submittedOnDates.js {{reportType}}
 *
 * To run the script without updating reports, use test=true:
 *
 * Local:
 *   test=true DYNAMODB_URL="http://localhost:8000" S3_LOCAL_ENDPOINT="http://localhost:4569" node services/database/scripts/add-submittedOnDates.js {{reportType}}
 * Branch:
 *   test=true branchPrefix="YOUR BRANCH NAME" node services/database/scripts/add-submittedOnDates.js {{reportType}}
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");
const { buildS3Client, list } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const isTest = !!process.env.test;
const branch = isLocal ? "local" : process.env.branchPrefix;
const reportType = process.argv[2] || "mcpar";
const tableName = `${branch}-${reportType}-reports`;
const bucketName = isLocal
  ? `${branch}-${reportType}-form`
  : `database-${branch}-${reportType}`;

async function handler() {
  try {
    console.log("\n== Fetching reports ==\n");

    const reports = await getDbItems();

    console.log(
      `\n==${isTest ? " [TEST]" : ""} Found ${
        reports.length
      } reports without submittedOnDates in table ${tableName} ==\n`
    );

    if (reports.length === 0) return;
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
  // Submitted reports that don't have submittedOnDates values
  return items.filter(
    ({ previousRevisions, submittedOnDate, submittedOnDates = [] }) => {
      const expectedSubmittedOnDatesCount = previousRevisions.length + 1;
      return (
        submittedOnDate &&
        submittedOnDates.length !== expectedSubmittedOnDatesCount
      );
    }
  );
}

async function updateDbItems(reports) {
  const transformedItems = await transformDbItems(reports);
  if (!isTest) await update(tableName, transformedItems);
  console.log(
    `\n==${isTest ? " [TEST]" : ""} Touched ${
      transformedItems.length
    } reports in table ${tableName} ==\n`
  );
}

async function transformDbItems(reports) {
  buildS3Client();

  const fieldData = {};

  // Group reports by state
  const reportsByState = reports.reduce((acc, report) => {
    if (!acc[report.state]) acc[report.state] = [];
    acc[report.state].push(report);
    return acc;
  }, {});

  // Fetch fieldData for each state only once
  for (const state of Object.keys(reportsByState)) {
    const bucketObjects = await list({
      Bucket: bucketName,
      Prefix: `fieldData/${state}`,
    });
    fieldData[state] = bucketObjects;
  }

  return await Promise.all(
    reports.map(async (report) => {
      const { id, previousRevisions, state, submittedOnDate } = report;
      // Some older reports have submittedOnDate as a string, so convert to number
      let submittedOnDates = [Number(submittedOnDate)];

      if (previousRevisions.length > 0) {
        const bucketObjects = fieldData[state];
        const fieldDataObjects = filterS3(bucketObjects, previousRevisions);

        if (fieldDataObjects.length > 0) {
          const fieldDataModifiedDates = fieldDataObjects.map((obj) =>
            // LastModified would approximate submission date
            new Date(obj.LastModified).getTime()
          );
          submittedOnDates = [...fieldDataModifiedDates, ...submittedOnDates];
        } else {
          console.log(`== Missing previousRevisions: ${id} ==`);
        }
      }

      return {
        ...report,
        submittedOnDates,
      };
    })
  );
}

function filterS3(bucketObjects, previousRevisions) {
  return bucketObjects.filter((obj) => {
    // Key is fieldData/state/uuid.json format, extract uuid
    const key = obj.Key.split("/");
    const keyId = key[key.length - 1].split(".")[0];

    return previousRevisions.includes(keyId);
  });
}

handler();
