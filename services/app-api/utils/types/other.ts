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

export interface S3List {
  Bucket: string;
}

export interface CompletionData {
  [key: string]: boolean | CompletionData;
}

// ALERTS

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

// TIME

export interface DateShape {
  year: number;
  month: number;
  day: number;
}

export interface TimeShape {
  hour: number;
  minute: number;
  second: number;
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

export interface FormTemplate {
  md5Hash: string;
  versionNumber: number;
  id: string;
  lastAltered: string;
  reportType: string;
}

export function isDefined<T>(
  possiblyUndefined: T | undefined
): possiblyUndefined is T {
  return typeof possiblyUndefined !== "undefined";
}

/**
 * Use this type to create a type guard for filtering arrays of objects
 * by the presence of certain attributes.
 *
 * @example
 * interface Foo {
 *    bar: string;
 *    baz?: string;
 *    buzz?: string;
 *    bizz?: string;
 * }
 * type RequireBaz = SomeRequired<Foo, 'baz'>
 * const array: Foo[] = [
 *  { bar: 'always here' },
 *  { bar: 'always here', baz: 'sometimes here' }
 * ]
 * array.filter((f): f is RequireBaz => typeof f.baz !== 'undefined' )
 * // `array`'s type now shows bar and baz as required.
 * array.map((f) => return f.baz)
 */
export type SomeRequired<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;
