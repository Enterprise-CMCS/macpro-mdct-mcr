import jwtDecode from "jwt-decode";
import handler from "../handler-lib";
// utils
import { hasPermissions } from "../../utils/auth/authorization";
import {
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import s3Lib, {
  getFieldDataKey,
  getFormTemplateKey,
} from "../../utils/s3/s3-lib";
import { convertDateUtcToEt } from "../../utils/time/time";
import { hasReportPathParams } from "../../utils/dynamo/hasReportPathParams";
// types
import {
  isState,
  MCPARReportMetadata,
  MLRReportMetadata,
  StatusCodes,
  UserRoles,
} from "../../utils/types";
import { logger } from "../../utils/debugging/debug-lib";

export const submitReport = handler(async (event, _context) => {
  const requiredParams = ["id", "reportType", "state"];
  if (
    !event.pathParameters ||
    !hasReportPathParams(event.pathParameters, requiredParams)
  ) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  const { id, state, reportType } = event.pathParameters;

  if (!isState(state)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }
  if (!hasPermissions(event, [UserRoles.STATE_USER], state)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const reportTable = reportTables[reportType as keyof typeof reportTables];
  const reportBucket = reportBuckets[reportType as keyof typeof reportBuckets];

  // Get report metadata
  const reportMetadataParams = {
    TableName: reportTable,
    Key: { id, state },
  };

  try {
    const response = await dynamodbLib.get(reportMetadataParams);
    if (!response?.Item) {
      return {
        status: StatusCodes.NOT_FOUND,
        body: error.NOT_IN_DATABASE,
      };
    }

    const reportMetadata = response.Item as
      | MLRReportMetadata
      | MCPARReportMetadata;
    const { status, isComplete, fieldDataId, formTemplateId } = reportMetadata;

    if (status === "Submitted") {
      return {
        status: StatusCodes.SUCCESS,
        body: {
          ...reportMetadata,
        },
      };
    }

    if (!isComplete) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.REPORT_INCOMPLETE,
      };
    }

    const jwt = jwtDecode(event.headers["x-api-key"]!) as Record<
      string,
      string | boolean
    >;

    const date = Date.now();
    const fullName = `${jwt.given_name} ${jwt.family_name}`;
    const newItem = {
      ...reportMetadata,
      submittedBy: fullName,
      submittedOnDate: date,
      status: "Submitted",
      locked: true,
      submissionCount: reportMetadata.submissionCount + 1,
    };

    const submitReportParams = {
      TableName: reportTable,
      Item: newItem,
    };
    try {
      await dynamodbLib.put(submitReportParams);
    } catch (e) {
      logger.error(e, "Error submitting report");
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.DYNAMO_UPDATE_ERROR,
      };
    }

    // Get field data
    const fieldDataParams = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
    };

    let existingFieldData;

    try {
      existingFieldData = (await s3Lib.get(fieldDataParams)) as Record<
        string,
        any
      >;
    } catch (e) {
      logger.error(e, "Error submitting report");
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.NOT_IN_DATABASE,
      };
    }

    const fieldData = {
      ...existingFieldData,
      submitterName: fullName,
      submitterEmailAddress: jwt.email,
      reportSubmissionDate: convertDateUtcToEt(date),
    };

    const updateFieldDataParams = {
      Bucket: reportBucket,
      Key: getFieldDataKey(state, fieldDataId),
      Body: JSON.stringify(fieldData),
      ContentType: "application/json",
    };

    const getFormTemplateParams = {
      Bucket: reportBucket,
      Key: getFormTemplateKey(formTemplateId),
    };

    let formTemplate;

    try {
      formTemplate = (await s3Lib.get(getFormTemplateParams)) as Record<
        string,
        any
      >;
    } catch (e) {
      logger.error(e, "Error submitting report");
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.NOT_IN_DATABASE,
      };
    }

    try {
      await s3Lib.put(updateFieldDataParams);
    } catch (e) {
      logger.error(e, "e submitting report");
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.S3_OBJECT_UPDATE_ERROR,
      };
    }

    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...newItem,
        fieldData: { ...fieldData },
        formTemplate: {
          ...formTemplate,
        },
      },
    };
  } catch (e) {
    logger.error(e, "Error submitting report");
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }
});
