import { AttributeValue, QueryInput } from "aws-sdk/clients/dynamodb";
import dynamodbLib from "../dynamo/dynamodb-lib";

const REPORT_TYPES = ["MCPAR", "MLR"] as const;

export function getNewestTemplateVersion(
  reportType: typeof REPORT_TYPES[number]
) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "LastAlteredIndex",
    KeyConditionExpression: "reportType = :report_type",
    ExpressionAttributeValues: {
      ":reportType": {
        S: reportType,
      },
    },
    Limit: 1,
    ScanIndexForward: false, // true = ascending, false = descending
  };
  return dynamodbLib.query(queryParams);
}

export function getTemplateVersionById(reportType: string, id: string) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "IdIndex",
    KeyConditionExpression: "reportType = :reportType AND id = :id",
    Limit: 1,
    ExpressionAttributeValues: {
      ":id": {
        S: id,
      },
      ":reportType": {
        S: reportType,
      },
    },
  };
  return dynamodbLib.query(queryParams);
}

export function getTemplateVersionByHash(reportType: string, hash: string) {
  const queryParams: QueryInput = {
    TableName: process.env.FORM_TEMPLATE_TABLE_NAME!,
    IndexName: "HashIndex",
    KeyConditionExpression: "reportType = :reportType AND md5Hash = :md5Hash",
    Limit: 1,
    ExpressionAttributeValues: {
      ":md5Hash": hash as AttributeValue,
      ":reportType": reportType as AttributeValue,
    },
  };
  return dynamodbLib.query(queryParams);
}
