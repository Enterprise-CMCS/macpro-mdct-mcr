/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/add-submissionDates.js {{reportType}}
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/add-submissionDates.js {{reportType}}
 *
 * To run the script without updating reports, use test=true:
 *
 * Local:
 *   test=true DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/add-submissionDates.js {{reportType}}
 * Branch:
 *   test=true branchPrefix="YOUR BRANCH NAME" node services/database/scripts/add-submissionDates.js {{reportType}}
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");
const { buildS3Client, list } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const isTest = !!process.env.test;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const reportType = process.argv[2] || "mcpar";
const tableName = `${branch}-${reportType}-reports`;
const bucketName = `database-${branch}-${reportType}`;

async function handler() {
  try {
    console.log("\n== Fetching reports ==\n");

    const reports = await getDbItems();

    console.log(
      `\n==${isTest ? " [TEST]" : ""} Found ${
        reports.length
      } reports without submissionDates in table ${tableName} ==\n`
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
  // Submitted reports that don't have submissionDates values
  return items.filter(
    ({ previousRevisions, submittedOnDate, submissionDates = [] }) => {
      const expectedSubmissionDatesCount = previousRevisions.length + 1;
      return (
        submittedOnDate &&
        submissionDates.length !== expectedSubmissionDatesCount
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
      const { id, fieldDataId, previousRevisions, state, submittedOnDate } =
        report;
      let submissionDates = [
        {
          fieldDataId,
          // Some older reports have submittedOnDate as a string, so convert to number
          submittedOnDate: Number(submittedOnDate),
        },
      ];

      if (previousRevisions.length > 0) {
        const bucketObjects = fieldData[state];
        const fieldDataObjects = filterS3(bucketObjects, previousRevisions);

        if (fieldDataObjects.length > 0) {
          console.log(fieldDataObjects);
          const fieldDataModifiedDates = fieldDataObjects.map(
            ({ Key, LastModified }) => ({
              fieldDataId: getKeyId(Key),
              // LastModified would approximate submission date
              submittedOnDate: new Date(LastModified).getTime(),
            })
          );
          submissionDates = [...fieldDataModifiedDates, ...submissionDates];
        } else {
          console.log(`== Missing previousRevisions: ${id} ==`);
        }
      }

      return {
        ...report,
        submissionDates,
      };
    })
  );
}

// Key is fieldData/state/uuid.json format, extract uuid
function getKeyId(key) {
  const keyParts = key.split("/");
  const keyId = keyParts[keyParts.length - 1].split(".")[0];
  return keyId;
}

function filterS3(bucketObjects, previousRevisions) {
  return bucketObjects.filter(({ Key }) =>
    previousRevisions.includes(getKeyId(Key))
  );
}

handler();
