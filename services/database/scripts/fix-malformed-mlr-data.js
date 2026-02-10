/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/fix-malformed-mlr-data.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-malformed-mlr-data.js
 */

const { buildS3Client, getObject, list, putObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const mlrBucketName = `database-${branch}-mlr`;

async function handler() {
  try {
    console.log("Searching for 2024 modifications");
    await updateS3Items();
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
  const allObjects = await list({
    Bucket: mlrBucketName,
    Prefix: "fieldData/",
  });
  const filteredObjects = filterS3ObjectsByYear(allObjects);
  await transformS3Objects(filteredObjects);
  console.log(
    `Touched ${filteredObjects.length} objects in bucket ${mlrBucketName}`
  );
}

function filterS3ObjectsByYear(bucketObjects) {
  return bucketObjects.filter(
    (obj) => new Date(obj.LastModified).getFullYear() === 2024
  );
}

async function transformS3Objects(objects) {
  for (const object of objects) {
    const s3FieldData = await getObject({
      Key: object.Key,
      Bucket: mlrBucketName,
    });
    removeMalformedData(s3FieldData);
    await putObject({
      Bucket: mlrBucketName,
      Key: object.Key,
      Body: JSON.stringify(s3FieldData),
      ContentType: "application/json",
    });
  }
}

// any keys starting with report_ or state_ should only exist within the program array
function removeMalformedData(data) {
  for (const key in data)
    if (key.startsWith("report_") || key.startsWith("state_")) delete data[key];
}

handler();
