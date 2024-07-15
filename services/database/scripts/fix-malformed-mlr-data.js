/* eslint-disable no-console */
/*
 * Local:
 *    `DYNAMODB_URL="http://localhost:8000" S3_LOCAL_ENDPOINT="http://localhost:4569" node services/database/scripts/fix-malformed-mlr-data.js`
 *  Branch:
 *    branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-malformed-mlr-data.js
 */

const { buildS3Client, getObject, list, putObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;

const mlrBucketName = isLocal
  ? "local-mlr-form"
  : "database-" + process.env.branchPrefix + "-mlr";

async function handler() {
  try {
    console.log("Searching for 2024 modifications");
    updateS3Items();
    console.debug("S3 data fix complete");

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

async function updateS3Items() {
  buildS3Client();

  console.log(`Processing bucket ${mlrBucketName}`);
  const existingObjects = await list({
    Bucket: mlrBucketName,
    Prefix: "fieldData/",
  });
  const filteredObjects = filterS3Objects(existingObjects);
  await transformS3Objects(filteredObjects);
  console.log(
    `Touched ${filteredObjects.length} objects in bucket ${mlrBucketName}`
  );
}

function filterS3Objects(bucketObjects) {
  return bucketObjects.filter(
    (obj) => new Date(obj.LastModified).getFullYear() === 2024
  );
}

async function transformS3Objects(objects) {
  for (const object of objects) {
    const s3Object = await getObject({
      Key: object.Key,
      Bucket: mlrBucketName,
    });
    removeMalformedData(s3Object);
    putObject({
      Bucket: mlrBucketName,
      Key: object.Key,
      Body: JSON.stringify(s3Object),
      ContentType: "application/json",
    });
  }
}

// any keys starting with report_ or state_ should only exist within the program array
function removeMalformedData(object) {
  for (const key in object)
    if (key.startsWith("report_") || key.startsWith("state_"))
      delete object[key];
}

handler();
