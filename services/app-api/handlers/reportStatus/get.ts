import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

export const getReportStatus = handler(async (event, _context) => {
  if (
    !event?.pathParameters?.reportId! ||
    !event?.pathParameters?.programName!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const statusParams = {
    TableName: process.env.REPORT_STATUS_TABLE_NAME!,
    Key: {
      key: event.pathParameters.reportId,
      programName: event.pathParameters.programName,
    },
  };
  const statusQueryResponse = await dynamoDb.get(statusParams);

  const statusItem =
    typeof statusQueryResponse.Item === "object"
      ? { ...statusQueryResponse.Item }
      : {};

  return {
    status: StatusCodes.SUCCESS,
    body: { ...statusItem },
  };
});
