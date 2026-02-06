/*
 * Local:
 *   DYNAMODB_URL="http://localhost:4566" S3_LOCAL_ENDPOINT="http://localhost:4566" node services/database/scripts/sync-kafka-2024.js
 * Branch:
 *   branchPrefix="YOUR BRANCH NAME" node services/database/scripts/sync-kafka-2024.js
 */

const { buildDynamoClient, scan, update } = require("./utils/dynamodb.js");
const { buildS3Client, list, putObjectTag } = require("./utils/s3.js");

const isLocal = !!process.env.DYNAMODB_URL;
const branch = isLocal ? "localstack" : process.env.branchPrefix;

const mcparTableName = `${branch}-mcpar-reports`;
const mlrTableName = `${branch}-mlr-reports`;
const tables = [mcparTableName, mlrTableName];

const mcparBucketName = `database-${branch}-mcpar`;
const mlrBucketName = `database-${branch}-mlr`;
const buckets = [mcparBucketName, mlrBucketName];

// Maintaining consistency with the `lastAltered` field in the DB
const dbSyncTime = Date.now();
// Using a human readable format for easier debugging in the future
const s3SyncTime = new Date().toISOString();

async function handler() {
  try {
    console.log("Searching for 2024 modifications");
    updateDbItems();
    console.debug("Database data fix complete");
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

async function updateDbItems() {
  buildDynamoClient();

  for (const tableName of tables) {
    console.log(`Processing table ${tableName}`);
    const existingItems = await scan({
      TableName: tableName,
    });
    const filteredItems = filterData(existingItems);
    const transformedItems = await transform(filteredItems);
    await update(tableName, transformedItems);
    console.log(`Touched ${transformedItems.length} in table ${tableName}`);
  }
}

function filterData(items) {
  return items.filter(
    (item) => new Date(item.lastAltered).getFullYear() === 2024
  );
}

async function transform(items) {
  // Touch sync field only
  const transformed = items.map((item) => {
    const corrected = { ...item, lastSynced: dbSyncTime };
    return corrected;
  });

  return transformed;
}

async function updateS3Items() {
  buildS3Client();

  for (const reportBucket of buckets) {
    console.log(`Processing bucket ${reportBucket}`);
    const existingObjects = await list({
      Bucket: reportBucket,
      Prefix: "fieldData/",
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
    (obj) => new Date(obj.LastModified).getFullYear() === 2024
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
