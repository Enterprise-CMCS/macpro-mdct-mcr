import { AnyObject } from "./other";
import { ReportJson } from "./reports";

// REPORT PROVIDER/CONTEXT

export interface ReportKeys {
  reportType: string;
  state: string;
  id: string;
}

export interface ReportMetadataShape extends ReportKeys {
  reportType: string;
  programName: string;
  status: ReportStatus;
  reportingPeriodStartDate: number;
  reportingPeriodEndDate: number;
  dueDate: number;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy: string;
  combinedData: boolean;
  submittedBy?: string;
  submitterEmail?: string;
  submittedOnDate?: number;
  archived?: boolean;
}

export interface ReportShape extends ReportMetadataShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
}

export interface ReportContextMethods {
  fetchReport: Function;
  fetchReportsByState: Function;
  archiveReport: Function;
  createReport: Function;
  updateReport: Function;
  clearReportSelection: Function;
  setReportSelection: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  submittedReportsByState: ReportMetadataShape[] | undefined;
  errorMessage?: string | undefined;
  lastSavedTime?: string | undefined;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}
