// GLOBAL

export interface AnyObject {
  [key: string]: any;
}

export interface CompletionData {
  [key: string]: boolean | CompletionData;
}

export interface DynamoGet {
  TableName: string;
  Key: {
    [key: string]: any;
  };
}

export interface DynamoWrite {
  TableName: string;
  Item: { [key: string]: any };
}

export interface DynamoDelete {
  TableName: string;
  Key: { [key: string]: any };
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
  [key: string]: any;
}

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const enum StatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export interface S3Put extends S3Get {
  Body: string;
  ContentType: string;
}

export interface S3Get {
  Bucket: string;
  Key: string;
}

// USERS

export const enum UserRoles {
  ADMIN = "mdctmcr-bor", // "MDCT MCR Business Owner Representative"
  HELP_DESK = "mdctmcr-help-desk", // "MDCTMCR Help Desk"
  APPROVER = "mdctmcr-approver", // "MDCT MCR Approver"
  STATE_REP = "mdctmcr-state-rep", // "MDCT MCR State Representative"
  STATE_USER = "mdctmcr-state-user", // "MDCT MCR State User"
}

// TEMPLATES

export const enum TemplateKeys {
  MCPAR = "templates/MCPAR_Workbook_AddProgramName_2022.xlsx",
  MLR = "templates/MLR_Workbook_2022.xlsx",
  NAAAR = "templates/NAAAR_Workbook_2022.xlsx",
}
