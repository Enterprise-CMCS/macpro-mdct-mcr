// GLOBAL

export interface AnyObject {
  [key: string]: any;
}

/**
 * Abridged copy of the type used by `aws-lambda@1.0.7` (from `@types/aws-lambda@8.10.88`)
 * We only this package for these types, and we use only a subset of the
 * properties. Since `aws-lambda` depends on `aws-sdk` (that is, SDK v2),
 * we can save ourselves a big dependency with this small redundancy.
 */

export interface APIGatewayProxyEventPathParameters {
  [name: string]: string | undefined;
}

export interface APIGatewayProxyEvent {
  body: string | null;
  headers: Record<string, string | undefined>;
  multiValueHeaders: Record<string, string | undefined>;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: Record<string, string | undefined> | null;
  queryStringParameters: Record<string, string | undefined> | null;
  multiValueQueryStringParameters: Record<string, string | undefined> | null;
  stageVariables: Record<string, string | undefined> | null;
  /** The context is complicated, and we don't (as of 2023) use it at all. */
  requestContext: any;
  resource: string;
}

/**
 * S3Create event
 * https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
 */

export interface S3EventRecordGlacierRestoreEventData {
  lifecycleRestorationExpiryTime: string;
  lifecycleRestoreStorageClass: string;
}
export interface S3EventRecordGlacierEventData {
  restoreEventData: S3EventRecordGlacierRestoreEventData;
}

export interface S3EventRecord {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: string;
  eventName: string;
  userIdentity: {
    principalId: string;
  };
  requestParameters: {
    sourceIPAddress: string;
  };
  responseElements: {
    "x-amz-request-id": string;
    "x-amz-id-2": string;
  };
  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      versionId?: string | undefined;
      sequencer: string;
    };
  };
  glacierEventData?: S3EventRecordGlacierEventData | undefined;
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

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  MODAL_OVERLAY = "modalOverlay",
  PLAN_OVERLAY = "planOverlay",
  REVIEW_SUBMIT = "reviewSubmit",
}

export interface ScreenReaderCustomHeaderName {
  hiddenName: string;
  name?: string;
}

export interface SortableHeadRow {
  [key: string]: {
    header: string;
    admin?: boolean;
    filter?: boolean;
    hidden?: boolean;
    sort?: boolean;
    stateUser?: boolean;
  };
}

export interface TableContentShape {
  caption?: string;
  headRow?: Array<string | ScreenReaderCustomHeaderName>;
  sortableHeadRow?: SortableHeadRow;
  bodyRows?: string[][];
}

export interface ErrorVerbiage {
  title: string;
  description: string | CustomHtmlElement[];
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

export interface FormTemplate {
  md5Hash: string;
  versionNumber: number;
  id: string;
  lastAltered: string;
  reportType: string;
}

// HELPER FUNCTIONS

export const isState = (state: unknown): state is State => {
  return states.includes(state as State);
};

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
