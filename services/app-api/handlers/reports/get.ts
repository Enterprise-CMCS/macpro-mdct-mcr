import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";

export const getReport = handler(async (event, _context) => {
  if (
    !event?.pathParameters?.stateYear! ||
    !event?.pathParameters?.programName!
  ) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const reportParams = {
    TableName: process.env.REPORT_TABLE_NAME!,
    Key: {
      key: event.pathParameters.stateYear,
      programName: event.pathParameters.programName,
    },
  };
  const reportQueryResponse = await dynamoDb.get(reportParams);

  const reportItem =
    typeof reportQueryResponse.Item === "object"
      ? { ...reportQueryResponse.Item }
      : {};

  return {
    status: StatusCodes.SUCCESS,
    body: { ...reportItem },
  };
});
