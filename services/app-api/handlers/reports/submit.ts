import { hasPermissions } from "../../utils/auth/authorization";
import { error } from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes, UserRoles } from "../../utils/types/types";
import handler from "../handler-lib";

export const submitReport = handler(async (event, _context) => {
  if (!event.pathParameters?.id || !event.pathParameters?.state) {
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

  const { id, state } = event.pathParameters;

  // Get report metadata
  const reportMetadataParams = {
    TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
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

    const reportMetadata = response.Item as Record<string, any>;

    const { status, isComplete } = reportMetadata;

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

    const newItem = {
      ...reportMetadata,
      status: "Submitted",
    };

    const submitReportParams = {
      Key: { key: id },
      TableName: process.env.MCPAR_REPORT_TABLE_NAME!,
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

    return {
      status: StatusCodes.SUCCESS,
      body: {
        ...newItem,
      },
    };
  } catch (err) {
    return {
      status: StatusCodes.NOT_FOUND,
      body: error.NO_MATCHING_RECORD,
    };
  }
});
