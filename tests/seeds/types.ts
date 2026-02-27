import {
  AnyObject,
  ReportMetadataShape,
} from "../../services/app-api/utils/types";

export type AwsHeaders = {
  "Content-Type"?: string;
  "X-Amz-Target"?: string;
  "x-api-key"?: string;
};

export type SeedReportMetadataShape = Omit<
  ReportMetadataShape,
  | "combinedData"
  | "createdAt"
  | "dueDate"
  | "fieldDataId"
  | "id"
  | "lastAltered"
  | "state"
  | "reportingPeriodEndDate"
  | "reportingPeriodStartDate"
> & {
  dueDate?: number;
  combinedData?: boolean;
  reportingPeriodEndDate?: number;
  reportingPeriodStartDate?: number;
  isComplete?: boolean;
};

export type SeedFillReportMetadataShape = Omit<
  SeedReportMetadataShape,
  | "dueDate"
  | "locked"
  | "previousRevisions"
  | "programName"
  | "reportType"
  | "reportingPeriodEndDate"
  | "reportingPeriodStartDate"
  | "submissionCount"
>;

export type SeedNewReportShape = {
  metadata: SeedReportMetadataShape;
  fieldData: AnyObject;
};

export type SeedFillReportShape = {
  metadata: SeedFillReportMetadataShape;
  fieldData: AnyObject;
};

export type SeedReportShape = ReportMetadataShape & {
  fieldData: AnyObject;
};

export type SeedBannerShape = {
  key: string;
  createdAt: number;
  lastAltered: number;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
};
