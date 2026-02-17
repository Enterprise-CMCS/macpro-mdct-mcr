/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/fix-copyover-data-leak.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-copyover-data-leak.js
 *
 * To run the script without updating reports, set test=true at the beginning of the command
 */

const { buildDynamoClient, scan } = require("./utils/dynamodb.js");
const { buildS3Client, list, putObject, getObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const isTest = !!process.env.test;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const tableName = `${branch}-mcpar-reports`;
const bucketName = `database-${branch}-mcpar`;

const updatedReports = [];

async function handler() {
  try {
    const reports = await getDbItems();

    console.log(
      `\n==${isTest ? " [TEST]" : ""} Found ${
        reports.length
      } reports that match the criteria in table ${tableName} ==\n`
    );

    if (reports.length === 0) return;

    await updateReports(reports);

    console.log(
      `${isTest ? "[TEST] " : ""}Number of ETLs: ${updatedReports.length}`
    );
    console.log(updatedReports);

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

// only return PCCM reports that were copied and are not archived
function filterDb(items) {
  return items.filter(
    ({ programIsPCCM, copyFieldDataSourceId, archived }) =>
      programIsPCCM?.[0]?.value === "Yes" && // is a PCCM report
      !!copyFieldDataSourceId && // is a copied report
      !archived // is not archived
  );
}

async function getS3Items(prefix) {
  buildS3Client();
  console.log(`Getting items with prefix ${prefix} from ${bucketName}`);
  const fileList = await list({
    Bucket: bucketName,
    Prefix: prefix,
  });
  return fileList;
}

async function updateReports(reports) {
  const fieldDataRecords = await getS3Items("fieldData/");
  const formTemplatesRecords = await getS3Items("formTemplates/");

  for (const report of reports) {
    const {
      fieldDataId,
      formTemplateId,
      id,
      programName,
      state,
      status,
      submissionDates,
    } = report;
    // find matching S3 records for fieldData and formTemplates
    const fieldDataKey = fieldDataRecords.find((dataObj) =>
      dataObj.Key.includes(fieldDataId)
    ).Key;
    const formTemplateKey = formTemplatesRecords.find((dataObj) =>
      dataObj.Key.includes(formTemplateId)
    ).Key;

    // check and update
    const wasUpdated = await transformS3Objects(fieldDataKey, formTemplateKey);

    // add to updated list
    if (wasUpdated) {
      let reportInfo = `ID: ${id}, Program Name: ${programName}, State: ${state}, Status: ${status}`;
      if (status === "Submitted") {
        reportInfo = `${reportInfo}, Submitted on: ${new Date(
          submissionDates[0].submittedOnDate
        )}`;
      }
      updatedReports.push(reportInfo);
    }
  }
}

async function transformS3Objects(fieldDataPath, formTemplatePath) {
  const s3FieldData = await getObject({
    Key: fieldDataPath,
    Bucket: bucketName,
  });

  const s3FormTemplate = await getObject({
    Key: formTemplatePath,
    Bucket: bucketName,
  });
  const needsToBeUpdated = removeIrrelevantData(s3FieldData, s3FormTemplate);
  if (needsToBeUpdated && !isTest) {
    await putObject({
      Bucket: bucketName,
      Key: fieldDataPath,
      Body: JSON.stringify(s3FieldData),
      ContentType: "application/json",
    });
  }
  return needsToBeUpdated;
}

const allMcparEntities = [
  "sanctions",
  "accessMeasures",
  "qualityMeasures",
  "plans",
  "bssEntities",
  "ilos",
];

function removeIrrelevantData(s3FieldData, s3FormTemplate) {
  const allowedEntities = Object.keys(s3FormTemplate.entities);
  let needsToBeUpdated = false;

  for (const dataKey of Object.keys(s3FieldData)) {
    // remove entities that should not exist in PCCM report
    if (
      allMcparEntities.includes(dataKey) &&
      !allowedEntities.includes(dataKey)
    ) {
      delete s3FieldData[dataKey];
      needsToBeUpdated = true;
    }
  }

  // remove copied program type other text since pccm report auto-selects the PCCM option
  if ("program_type-otherText" in s3FieldData) {
    delete s3FieldData["program_type-otherText"];
    needsToBeUpdated = true;
  }

  return needsToBeUpdated;
}

handler();
