// GLOBAL

export interface AnyObject {
  [key: string]: any;
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

export interface CompletionData {
  [key: string]: boolean | CompletionData;
}

// OTHER

export interface CustomHtmlElement {
  type: string;
  content: string | any;
  as?: string;
  props?: AnyObject;
}

export const enum TemplateKeys {
  MCPAR = "templates/mcpar-reporting-template.xlsx",
  MLR = "templates/mlr-reporting-template.xlsx",
  NAAAR = "templates/naaar-reporting-template.xlsx",
}

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;
export type State = typeof states[number];

export const isState = (state: unknown): state is State => {
  return states.includes(state as State);
};

export interface FormTemplate {
  md5Hash: string;
  versionNumber: number;
  id: string;
  lastAltered: string;
  reportType: string;
}

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
