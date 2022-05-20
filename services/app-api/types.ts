// GLOBAL

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface DynamoCreate {
  TableName: string;
  Item: { [key: string]: any };
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

// USERS

export const enum UserRoles {
  ADMIN = "mdctmcr-approver",
  STATE = "mdctmcr-state-user",
  HELP = "mdctmcr-help-desk",
  STATE_REP = "mdctmcr-state-rep",
  BOR = "mdctmcr-bor",
}

// BANNERS

export interface BannerData {
  key: string;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy?: string;
  title: string;
  description: string;
  link: string;
  startDate: number;
  endDate: number;
}
