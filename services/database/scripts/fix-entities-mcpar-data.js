/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/fix-entities-mcpar-data.js {{state}} {{fieldDataId}}
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/fix-entities-mcpar-data.js {{state}} {{fieldDataId}}
 */

const { buildS3Client, getObject, list, putObject } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;
const mcparBucketName = `database-${branch}-mcpar`;

const state = process.argv.slice(2, 3);
const fieldDataId = process.argv.slice(3);

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
    Prefix: `fieldData/${state}/${fieldDataId}`,
  });
  await transformS3Object(allObjects[0]);
  console.log(
    `Touched ${allObjects.length} objects in bucket ${mcparBucketName}`
  );
}

async function transformS3Object(object) {
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

// any matching "qualityMeasures" entities are set to empty arrays
function fixBadEntityData(data) {
  for (const key in data) if (key === "qualityMeasures") data[key] = [];
}

handler();
