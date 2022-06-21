// GLOBAL

export interface DynamoGet {
  TableName: string;
  Key: {
    key: string;
  };
}

export interface DynamoWrite {
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

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const enum StatusCodes {
  SUCCESS = 200,
  UNAUTHORIZED = 403,
}

// USERS

export const enum UserRoles {
  ADMIN = "mdctmcr-approver",
  STATE = "mdctmcr-state-user",
  HELP = "mdctmcr-help-desk",
  STATE_REP = "mdctmcr-state-rep",
  BOR = "mdctmcr-bor",
}

// TEMPLATES

export const enum TemplateKeys {
  MCPAR = "templates/MCPAR_Workbook_AddProgramName_2022.xlsx",
  MLR = "templates/MLR_Workbook_AddProgramName_2022.xlsx",
  NAAAR = "templates/NAAAR_Workbook_AddProgramName_2022.xlsx",
}
