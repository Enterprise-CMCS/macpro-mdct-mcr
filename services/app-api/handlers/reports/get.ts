import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

export const getReport = handler(async (event, _context) => {
  if (!event?.pathParameters?.reportId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const statusParams = {
    TableName: process.env.REPORT_STATUS_TABLE_NAME!,
    Key: {
      key: event.pathParameters.reportId,
    },
  };
  const reportParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
    Key: {
      key: event.pathParameters.reportId,
    },
  };
  const statusQueryResponse = await dynamoDb.get(statusParams);
  const reportQueryResponse = await dynamoDb.get(reportParams);

  const statusItem =
    typeof statusQueryResponse.Item === "object"
      ? { ...statusQueryResponse.Item }
      : {};
  const reportItem =
    typeof reportQueryResponse.Item === "object"
      ? { ...reportQueryResponse.Item }
      : {};

  return {
    status: StatusCodes.SUCCESS,
    body: { ...statusItem, ...reportItem },
  };
});
