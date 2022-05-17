/* eslint-disable no-unused-vars */

export interface Banner {
  compoundKey: string;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy?: string;
  banner: string;
}

export interface DynamoBannerList {
  Items?: Banner[];
  Count?: number;
  ScannedCount?: number;
}

export interface DynamoCreate {
  TableName: string;
  Item: Banner;
}

export interface DynamoDelete {
  TableName: string;
  Key: {
    compoundKey: string;
  };
}

export interface DynamoUpdate {
  TableName: string;
  Key: {
    compoundKey: string;
  };
  UpdateExpression?: string;
  ExpressionAttributeNames: { [key: string]: string };
  ExpressionAttributeValues: { [key: string]: any };
}

export interface DynamoScan {
  TableName: string;
  FilterExpression?: string;
  ExpressionAttributeNames: { [key: string]: string };
  ExpressionAttributeValues: { [key: string]: any };
}

export interface DynamoFetch {
  TableName: string;
  Key: {
    compoundKey: string;
  };
}

export const enum UserRoles {
  ADMIN = "mdctmcr-approver",
  STATE = "mdctmcr-state-user",
  HELP = "mdctmcr-help-desk",
  STATE_REPRESENTATIVE = "mdctmcr-state-rep",
  BOR = "mdctmcr-bor",
}

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}
