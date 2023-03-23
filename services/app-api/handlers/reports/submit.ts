import { bool } from "aws-sdk/clients/signer";
import jwtDecode from "jwt-decode";
import { hasPermissions } from "../../utils/auth/authorization";
import {
  buckets,
  error,
  reportBuckets,
  reportTables,
} from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import s3Lib from "../../utils/s3/s3-lib";
import { convertDateUtcToEt } from "../../utils/time/time";
import {
  isMLRReportMetadata,
  MCPARReportMetadata,
  MLRReportMetadata,
  StatusCodes,
  UserRoles,
} from "../../utils/types/types";
import handler from "../handler-lib";

export const submitReport = handler(async (event, _context) => {
  if (
    !event.pathParameters?.id ||
    !event.pathParameters?.state ||
    !event.pathParameters.reportType
  ) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: error.NO_KEY,
    };
  }

  if (!hasPermissions(event, [UserRoles.STATE_USER, UserRoles.STATE_REP])) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: error.UNAUTHORIZED,
    };
  }

  const { id, state, reportType } = event.pathParameters;

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

    if (!isComplete && reportMetadata.reportType === "MCPAR") {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.REPORT_INCOMPLETE,
      };
    }

    const jwt = jwtDecode(event.headers["x-api-key"]!) as Record<
      string,
      string | bool
    >;

    const date = Date.now();
    const fullName = `${jwt.given_name} ${jwt.family_name}`;
    const isMLR = isMLRReportMetadata(reportMetadata);
    const newItem = {
      ...reportMetadata,
      submittedBy: fullName,
      submittedOnDate: date,
      status: "Submitted",
      locked: isMLR ? true : undefined,
      submissionCount: isMLR ? reportMetadata.submissionCount + 1 : undefined,
    };

    const submitReportParams = {
      TableName: reportTable,
      Item: newItem,
    };
    try {
      await dynamodbLib.put(submitReportParams);
    } catch (err) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.DYNAMO_UPDATE_ERROR,
      };
    }

    // Get field data
    const fieldDataParams = {
      Bucket: reportBucket,
      Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
    };

    let existingFieldData;

    try {
      existingFieldData = (await s3Lib.get(fieldDataParams)) as Record<
        string,
        any
      >;
    } catch (err) {
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
      Key: `${buckets.FIELD_DATA}/${state}/${fieldDataId}.json`,
      Body: JSON.stringify(fieldData),
      ContentType: "application/json",
    };

    const getFormTemplateParams = {
      Bucket: reportBucket,
      Key: `${buckets.FORM_TEMPLATE}/${state}/${formTemplateId}.json`,
    };

    let formTemplate;

    try {
      formTemplate = (await s3Lib.get(getFormTemplateParams)) as Record<
        string,
        any
      >;
    } catch (err) {
      return {
        status: StatusCodes.SERVER_ERROR,
        body: error.NOT_IN_DATABASE,
      };
    }

    try {
      await s3Lib.put(updateFieldDataParams);
    } catch (err) {
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
  } catch (err) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }
});
