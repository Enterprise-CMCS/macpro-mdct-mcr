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

export interface S3Copy {
  Bucket: string;
  CopySource: string;
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

export type State =
  | "AL"
  | "AK"
  | "AZ"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DE"
  | "DC"
  | "FL"
  | "GA"
  | "HI"
  | "ID"
  | "IL"
  | "IN"
  | "IA"
  | "KS"
  | "KY"
  | "LA"
  | "ME"
  | "MD"
  | "MA"
  | "MI"
  | "MN"
  | "MS"
  | "MO"
  | "MT"
  | "NE"
  | "NV"
  | "NH"
  | "NJ"
  | "NM"
  | "NY"
  | "NC"
  | "ND"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "PR"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VT"
  | "VA"
  | "WA"
  | "WV"
  | "WI"
  | "WY";

export interface ReportMetadata {
  archived: boolean;
  reportType: string;
  submittedBy?: string;
  createdAt: number;
  lastAltered: number;
  state: State;
  id: string;
  submittedOnDate?: string;
  fieldDataId: string;
  formTemplateId: string;
  lastAlteredBy: string;
  status: string;
  isComplete: boolean;
}

export interface MLRReportMetadata extends ReportMetadata {
  locked: boolean;
  reportType: "MLR";
  submissionName: string;
  submissionCount: number;
  previousRevisions: string[];
}

export interface MCPARReportMetadata extends ReportMetadata {
  programName: string;
  reportType: "MCPAR";
  reportingPeriodStartDate: number;
  reportingPeriodEndDate: number;
  dueDate: number;
  combinedData: boolean;
}

/**
 * Type guard to perform run-time checks on report types.
 *
 * Use this function on data retrieved from Dynamo allow your data to be safely typed.
 * @param report any report type
 * @returns
 */
export function isMLRReportMetadata(
  report: unknown
): report is MLRReportMetadata {
  return (
    (report as MLRReportMetadata).reportType === "MLR" &&
    (report as MLRReportMetadata).locked !== undefined &&
    (report as MLRReportMetadata).submissionCount !== undefined &&
    (report as MLRReportMetadata).previousRevisions !== undefined
  );
}
