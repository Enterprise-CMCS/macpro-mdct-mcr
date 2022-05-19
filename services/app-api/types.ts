export interface BannerData {
  key: string;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy?: string;
  type: string;
  title: string;
  description: string;
}

export interface DynamoBannerList {
  Items?: BannerData[];
  Count?: number;
  ScannedCount?: number;
}

export interface DynamoCreate {
  TableName: string;
  Item: BannerData;
}

export interface DynamoDelete {
  TableName: string;
  Key: {
    key: string;
  };
}

export interface DynamoUpdate {
  TableName: string;
  Key: {
    key: string;
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

export interface DynamoGet {
  TableName: string;
  Key: {
    key: string;
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
