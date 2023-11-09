/* eslint-disable no-console */
import { APIGatewayProxyResult } from "aws-lambda";
import { ReportStatus, ReportType } from "../../utils/types";
import { reportTables } from "../../utils/constants/constants";
import dynamodbLib from "../../utils/dynamo/dynamodb-lib";

export const addRevisionsHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    await addRevisionsToExistingMcparReports();

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

const addRevisionsToExistingMcparReports = async () => {
  const TableName = reportTables[ReportType.MCPAR];
  for await (const reportMetadata of dynamodbLib.scanIterator({ TableName })) {
    if (reportMetadata.previousRevisions === undefined) {
      const wasSubmitted = reportMetadata.status === ReportStatus.SUBMITTED;

      // TODO should we change lastAltered?
      reportMetadata.previousRevisions = [];
      reportMetadata.submissionCount = wasSubmitted ? 1 : 0;
      reportMetadata.locked = wasSubmitted ? true : false;

      await dynamodbLib.put({
        TableName,
        Item: reportMetadata,
      });
    }
  }
};
