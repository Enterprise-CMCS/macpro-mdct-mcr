import { QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";

const REPORT_TYPES = ["MCPAR", "MLR"] as const;

export function getNewestTemplateVersion(
  reportType: typeof REPORT_TYPES[number]
) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "LastAlteredIndex",
    KeyConditionExpression: "reportType = :report_type",
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
    ExpressionAttributeValues: {
      ":report_type": {
        S: reportType,
      },
    },
  };
  return dynamodbLib.query(queryParams);
}

export function getTemplateVersionById(id: string) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "IdIndex",
    KeyConditionExpression: "id = :id",
    Limit: 1,
    ExpressionAttributeValues: {
      ":id": {
        S: id,
      },
    },
  };
  return dynamodbLib.query(queryParams);
}
