import handler from "../handler-lib";
// utils
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import {
  DynamoGet,
  DynamoWrite,
  isMLRReportMetadata,
  MLRReportMetadata,
  S3Get,
  S3Put,
  StatusCodes,
  UserRoles,
} from "../../utils/types/types";
import {
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import { hasPermissions } from "../../utils/auth/authorization";
import KSUID from "ksuid";
import s3Lib, { getFieldDataKey } from "../../utils/s3/s3-lib";

/**
 * Locked MLR reports can be released by admins.
 *
 * When reports are released:
 *
 * 1) Report metadata is set to `locked=false`
 * 2) previousVersions has current metadata fieldDataId appended
 * 3) Report table row is updated with new fieldDataId
 * 4) User can now edit report.
 *
 */
export const releaseReport = handler(async (event) => {
  // Return a 403 status if the user is not an admin.
  if (!hasPermissions(event, [UserRoles.ADMIN])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  if (
    !event.pathParameters?.id ||
    !event.pathParameters?.state ||
    !event.pathParameters?.reportType
  ) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const { id, state, reportType } = event.pathParameters;

  const reportTable = reportTables[reportType as keyof typeof reportTables];
  // Get report metadata

  const reportMetadataParams: DynamoGet = {
    Key: { id, state },
    TableName: reportTable,
  };

  let reportMetadata;

  try {
    reportMetadata = await dynamoDb.get(reportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  if (!reportMetadata.Item) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const metadata = reportMetadata.Item;

  // Non MLR reports cannot be released.
  if (!isMLRReportMetadata(metadata)) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }

  const isLocked = metadata.locked;

  // Report is not locked.
  if (!isLocked) {
    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...metadata,
      },
    };
  }

  const isArchived = metadata.archived;

  if (isArchived) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.ALREADY_ARCHIVED,
    };
  }

  const newFieldDataId = KSUID.randomSync().string;

  const previousRevisions = Array.isArray(metadata.previousRevisions)
    ? metadata.previousRevisions.concat([metadata.fieldDataId])
    : [metadata.fieldDataId];

  const newReportMetadata: MLRReportMetadata = {
    ...metadata,
    fieldDataId: newFieldDataId,
    locked: false,
    previousRevisions,
    status: "In progress",
    submissionCount: (metadata.submissionCount += 1),
  };

  const putReportMetadataParams: DynamoWrite = {
    TableName: reportTable,
    Item: newReportMetadata,
  };

  try {
    await dynamoDb.put(putReportMetadataParams);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.DYNAMO_UPDATE_ERROR,
    };
  }

  // Copy the original field data to a new location.
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];

  const getObjectParameters: S3Get = {
    Bucket: reportBucket,
    Key: getFieldDataKey(metadata.state, metadata.fieldDataId),
  };

  try {
    const fieldData = (await s3Lib.get(getObjectParameters)) as Record<
      string,
      any
    >;

    const putObjectParameters: S3Put = {
      Bucket: reportBucket,
      Body: JSON.stringify({
        ...fieldData,
        versionControl: [
          {
            // pragma: allowlist nextline secret
            key: "versionControl-cyUSrTH8mWdpqAKExLZAkz",
            value: "Yes, this is a resubmission",
          },
        ],
      }),
      ContentType: "application/json",
      Key: getFieldDataKey(metadata.state, newFieldDataId),
    };

    await s3Lib.put(putObjectParameters);
  } catch (err) {
    return {
      status: StatusCodes.SERVER_ERROR,
      body: error.S3_OBJECT_CREATION_ERROR,
    };
  }

  return {
    status: StatusCodes.SUCCESS,
    body: putReportMetadataParams.Item,
  };
});
