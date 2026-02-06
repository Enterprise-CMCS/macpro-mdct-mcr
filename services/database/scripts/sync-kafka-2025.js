/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/sync-kafka-2025.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/sync-kafka-2025.js
 */

const { buildS3Client, list, putObjectTag } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;

const mcparBucketName = `database-${branch}-mcpar`;
const mlrBucketName = `database-${branch}-mlr`;
const naaarBucketName = `database-${branch}-naaar`;
const buckets = [mcparBucketName, mlrBucketName, naaarBucketName];

// Using a human readable format for easier debugging in the future
const s3SyncTime = new Date().toISOString();
// The time to compare against for filtering items
const compareToTime = new Date("7 July 2025 00:00").getTime();

async function handler() {
  try {
    console.log("Searching for July 2025 modifications");
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

  for (const reportBucket of buckets) {
    console.log(`Processing bucket ${reportBucket}`);
    const existingObjects = await list({
      Bucket: reportBucket,
    });
    const filteredObjects = filterS3Objects(existingObjects);
    await tagObjects(reportBucket, filteredObjects);
    console.log(
      `Touched ${filteredObjects.length} objects in bucket ${reportBucket}`
    );
  }
}

function filterS3Objects(bucketObjects) {
  return bucketObjects.filter(
    (obj) => new Date(obj.LastModified).getTime() > compareToTime
  );
}

async function tagObjects(bucketName, objectList) {
  for (const obj of objectList) {
    const params = {
      Bucket: bucketName,
      Key: obj.Key,
      Tagging: {
        TagSet: [
          {
            Key: "lastSyncedByTag",
            Value: s3SyncTime,
          },
        ],
      },
    };
    await putObjectTag(params);
  }
}

handler();
