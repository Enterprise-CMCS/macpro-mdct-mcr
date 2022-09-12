import handler from "../handler-lib";
import dynamoDb from "../../utils/dynamo/dynamodb-lib";
import { StatusCodes } from "../../utils/types/types";
import { NO_KEY_ERROR_MESSAGE } from "../../utils/constants/constants";
import { sanitize } from "../../utils/sanitize";

export const getReportData = handler(async (event, _context) => {
  if (!event?.pathParameters?.state! || !event?.pathParameters?.reportId!) {
    throw new Error(NO_KEY_ERROR_MESSAGE);
  }
  const queryParams = {
    TableName: process.env.REPORT_DATA_TABLE_NAME!,
    KeyConditionExpression: "#state = :state AND #reportId = :reportId",
    ExpressionAttributeValues: {
      ":state": event.pathParameters.state,
      ":reportId": event.pathParameters.reportId,
    },
    ExpressionAttributeNames: {
      "#state": "state",
      "#reportId": "reportId",
    },
  };
  const reportQueryResponse = await dynamoDb.query(queryParams);

  const responseBody = reportQueryResponse.Items![0] ?? {};

  const entries = Object.entries(responseBody.fieldData);
  const newFieldData: any = {};

  for (let index = 0; index < entries.length; index++) {
    const entry: any = entries[index];

    if (typeof entry[1] !== "string") {
      const entryValueArray = [];

      for (let ind = 0; ind < entry[1].length; ind++) {
        const item = entry[1][ind];
        entryValueArray.push(sanitize(item));
      }

      newFieldData[`${entry[0]}`] = entryValueArray;
    } else {
      newFieldData[`${entry[0]}`] = sanitize(entry[1]);
    }
  }

  responseBody.fieldData = newFieldData;

  return {
    status: StatusCodes.SUCCESS,
    body: responseBody,
  };
});
