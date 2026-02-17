/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/fix-extra-plan-data.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-extra-plan-data.js
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
  const reports = filterArchivedReports(items);
  return reports;
}

// only return reports that are not archived
function filterArchivedReports(items) {
  return items.filter(({ archived }) => !archived);
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

function getKeysToRemove(s3FieldData, s3FormTemplate) {
  const keysToRemove = [];

  const planLevelIndicators = s3FormTemplate?.routes.filter(
    (route) => route.path === "/mcpar/plan-level-indicators"
  );

  // get prior authorization form info and list keys to remove if necessary
  const priorAuthorizationRoute = planLevelIndicators[0].children?.filter(
    (child) => child.path === "/mcpar/plan-level-indicators/prior-authorization"
  );
  if (priorAuthorizationRoute.length > 0) {
    const priorAuthDrawerFields =
      priorAuthorizationRoute[0].drawerForm?.fields?.map((field) => {
        return field.id;
      });

    const priorAuthYesNoRadio = priorAuthorizationRoute[0].form.fields[0].id;

    if (s3FieldData[priorAuthYesNoRadio]?.[0].value !== "Yes") {
      keysToRemove.push(...priorAuthDrawerFields);
    }
  }

  // get patient access api form info and list keys to remove if necessary
  const patientAccessApiRoute = planLevelIndicators[0].children?.filter(
    (child) => child.path === "/mcpar/plan-level-indicators/patient-access-api"
  );
  if (patientAccessApiRoute.length > 0) {
    const patientAccessApiDrawerFields =
      patientAccessApiRoute[0].drawerForm?.fields?.map((field) => {
        return field.id;
      });
    const patientAccessApiYesNoRadio =
      patientAccessApiRoute[0].form.fields[0].id;

    if (s3FieldData[patientAccessApiYesNoRadio]?.[0].value !== "Yes") {
      keysToRemove.push(...patientAccessApiDrawerFields);
    }
  }

  return keysToRemove;
}

function removeIrrelevantData(s3FieldData, s3FormTemplate) {
  let needsToBeUpdated = false;
  const keysToRemove = getKeysToRemove(s3FieldData, s3FormTemplate);
  const plans = s3FieldData.plans;

  if (keysToRemove.length > 0 && plans?.length > 0) {
    for (const plan of plans) {
      for (const key of keysToRemove) {
        if (plan[key]) {
          delete plan[key];
          needsToBeUpdated = true;
        }
      }
    }
  }

  return needsToBeUpdated;
}

handler();
