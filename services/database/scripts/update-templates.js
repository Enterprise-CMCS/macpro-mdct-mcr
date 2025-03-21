/* eslint-disable no-console */
/*
 * Local:
 *    `DYNAMODB_URL="http://localhost:8000" S3_LOCAL_ENDPOINT="http://localhost:4569" node services/database/scripts/sync-kafka-2024.js`
 *  Branch:
 *    branchPrefix="YOUR BRANCH NAME" node services/database/scripts/sync-kafka-2024.js
 */

const { buildS3Client, list, putObjectTag } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;

const mcparBucketName = isLocal
  ? "local-mcpar-form"
  : "database-" + process.env.branchPrefix + "-mcpar";
const mlrBucketName = isLocal
  ? "local-mlr-form"
  : "database-" + process.env.branchPrefix + "-mlr";
const buckets = [mcparBucketName, mlrBucketName];

// Using a human readable format for easier debugging in the future
const s3SyncTime = new Date().toISOString();

async function handler() {
  try {
    console.log("Searching for existing templates");
    updateS3Items();
    console.debug("S3 template update complete");

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
      Prefix: "formTemplates/",
    });
    await tagObjects(reportBucket, existingObjects);
    console.log(
      `Touched ${existingObjects.length} objects in bucket ${reportBucket}`
    );
  }
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
