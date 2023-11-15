/* eslint-disable no-console */
import { APIGatewayProxyResult } from "aws-lambda";
import { ReportType } from "../../utils/types";
import { reportTables } from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";

export const addPccmHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    await addPccmRadioToExistingMcparReports();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Update complete",
      }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};

const addPccmRadioToExistingMcparReports = async () => {
  const TableName = reportTables[ReportType.MCPAR];
  for await (const reportMetadata of dynamodbLib.scanIterator({ TableName })) {
    if (reportMetadata?.programIsPCCM !== undefined) {
      continue;
    }

    reportMetadata.programIsPCCM = [
      {
        key: "programIsPCCM-no_programIsNotPCCM",
        value: "No",
      },
    ];

    await dynamodbLib.put({
      TableName,
      Item: reportMetadata,
    });
  }
};
