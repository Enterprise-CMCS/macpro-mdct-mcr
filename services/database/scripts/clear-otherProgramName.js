/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/clear-otherProgramName.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/clear-otherProgramName.js
 */

const { buildS3Client, getObject, list, putObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const mlrBucketName = `database-${branch}-mlr`;

const fieldToRemove = "report_otherProgramName";

async function handler() {
  try {
    const updatedCount = await updateS3Items();
    console.log(
      `Removed "${fieldToRemove}" from ${updatedCount} report(s) in ${mlrBucketName}`
    );

    return {
      statusCode: 200,
      body: "All done!",
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: error.message,
    };
  }
}

async function updateS3Items() {
  buildS3Client();

  console.log(`Processing bucket ${mlrBucketName}`);
  const fieldDataObjects = await list({
    Bucket: mlrBucketName,
    Prefix: "fieldData/",
  });

  let updatedCount = 0;
  for (const fieldDataObject of fieldDataObjects) {
    const s3FieldData = await getObject({
      Key: fieldDataObject.Key,
      Bucket: mlrBucketName,
    });

    const wasUpdated = removeField(s3FieldData);
    if (wasUpdated) {
      updatedCount += 1;
      await putObject({
        Bucket: mlrBucketName,
        Key: fieldDataObject.Key,
        Body: JSON.stringify(s3FieldData),
        ContentType: "application/json",
      });
    }
  }

  return updatedCount;
}

// `report_otherProgramName` only exists within the program array;
// only drop the key when the name is empty
function removeField(data) {
  let needsToBeUpdated = false;

  for (const entity of data.program ?? []) {
    const entries = entity[fieldToRemove];
    if (!Array.isArray(entries)) continue;

    const kept = entries.filter((entry) => (entry?.name ?? "") !== "");
    if (kept.length === entries.length) continue;

    if (kept.length === 0) {
      delete entity[fieldToRemove];
    } else {
      entity[fieldToRemove] = kept;
    }
    needsToBeUpdated = true;
  }

  return needsToBeUpdated;
}

handler();
