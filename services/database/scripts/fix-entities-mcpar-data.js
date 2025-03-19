/* eslint-disable no-console */
/*
 * Local:
 *    `DYNAMODB_URL="http://localhost:8000" S3_LOCAL_ENDPOINT="http://localhost:4569" node services/database/scripts/fix-entities-mcpar-data.js`
 *  Branch:
 *    branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-entities-mcpar-data.js
 */

const { buildS3Client, getObject, list, putObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;

const mcparBucketName = isLocal
  ? "local-mcpar-form"
  : "database-" + process.env.branchPrefix + "-mcpar";

async function handler() {
  try {
    console.log("Searching for bad entities in report");
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

  console.log(`Processing bucket ${mcparBucketName}`);
  const allObjects = await list({
    Bucket: mcparBucketName,
    Prefix: "fieldData/",
  });
  const filteredObjects = filterS3ObjectsById(allObjects);
  await transformS3Objects(filteredObjects);
  console.log(
    `Touched ${filteredObjects.length} objects in bucket ${mcparBucketName}`
  );
}

function filterS3ObjectsById(bucketObjects) {
  return bucketObjects.filter((obj) =>
    [
      "2dxVLCY92B2LlM8DrHpEzqy4IOt", // pragma: allowlist secret
      "2e0c9p1wDwKR7VHaC0OoA05ef7M", // pragma: allowlist secret
      "2iQ4W9olixiQB6SfhaNlDyxPRx1", // pragma: allowlist secret
      "2q25RuoPYKXf1tuJuVaUm1VHSVP", // pragma: allowlist secret
      "2nkfD0lAyvuEEU4N4LqQBtcCi5H", // pragma: allowlist secret
      "2nkg1D1PauC4yW8qGh4pENkjgJi", // pragma: allowlist secret
    ].contains(obj.Id)
  );
}

async function transformS3Objects(objects) {
  for (const object of objects) {
    const s3FieldData = await getObject({
      Key: object.Key,
      Bucket: mcparBucketName,
    });
    fixBadEntityData(s3FieldData);
    await putObject({
      Bucket: mcparBucketName,
      Key: object.Key,
      Body: JSON.stringify(s3FieldData),
      ContentType: "application/json",
    });
  }
}

// any matching "qualityMeasures" entities are set to empty arrays
function fixBadEntityData(data) {
  for (const key in data) if (key === "qualityMeasures") data[key] = [];
}

handler();
