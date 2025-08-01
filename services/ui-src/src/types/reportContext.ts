// REPORT PROVIDER/CONTEXT

import {
  AnyObject,
  Choice,
  ErrorVerbiage,
  ReportJson,
  SelectedOption,
} from "types";

export interface ReportKeys {
  reportType: string;
  state: string;
  id: string;
}

export interface ReportMetadataShape extends ReportKeys {
  submissionCount: number;
  reportType: string;
  programName: string;
  submissionName?: string;
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
  submissionDates?: { revisionId: string; submittedOnDate: number }[];
  archived?: boolean;
  locked: boolean;
  fieldDataId: string;
  copyFieldDataSourceId?: string;
  programIsPCCM?: Choice[];
  naaarSubmissionForThisProgram?: Choice[];
  previousRevisions: string[];
  planTypeIncludedInProgram?: Choice[];
  "planTypeIncludedInProgram-otherText"?: string;
  newOrExistingProgram?: Choice[];
  existingProgramNameSelection?: SelectedOption;
  existingProgramNameSuggestion?: string;
  newProgramName?: string;
  naaarSubmissionDateForThisProgram?: string;
  naaarExpectedSubmissionDateForThisProgram?: string;
}

export interface ReportShape extends ReportMetadataShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
  completionStatus?: CompletionData;
  isComplete?: boolean;
}

export interface CompletionData {
  [key: string]: boolean | CompletionData;
}

export interface ReportContextMethods {
  fetchReport: Function;
  fetchReportsByState: Function;
  archiveReport: Function;
  releaseReport: Function;
  submitReport: Function;
  createReport: Function;
  updateReport: Function;
  clearReportSelection: Function;
  clearReportsByState: Function;
  setReportSelection: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  contextIsLoaded: boolean;
  errorMessage?: ErrorVerbiage | undefined;
  isReportPage: boolean;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

export interface ReportPageProgress {
  name: string;
  path: string;
  children?: ReportPageProgress[];
  status?: boolean;
}
