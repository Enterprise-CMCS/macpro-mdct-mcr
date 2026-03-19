import {
  Choice,
  FormJson,
  AnyObject,
  CustomHtmlElement,
  State,
  CompletionData,
  EntityType,
  ScreenReaderCustomHeaderName,
  TableContentShape,
  SelectedOption,
} from "./index";

// REPORT TYPES
export enum ReportType {
  MCPAR = "MCPAR",
  MLR = "MLR",
  NAAAR = "NAAAR",
}

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  type?: string;
  name: string;
  basePath: string;
  routes: ReportRoute[];
  entities: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  validationSchema?: AnyObject;
  /**
   * The validationJson property is populated at the moment any form template
   * is stored in S3 for the first time. It will be populated from that moment on.
   */
  validationJson?: AnyObject;
}

export type ReportRoute = ReportRouteWithForm | ReportRouteWithoutForm;

export interface ReportRouteBase {
  name: string;
  path: string;
  pageType?: string;
  flag?: string;
}

export type ReportRouteWithForm =
  | StandardReportPageShape
  | DrawerReportPageShape
  | ModalDrawerReportPageShape
  | ModalOverlayReportPageShape
  | OverlayReportPageShape;

export interface ReportPageShapeBase extends ReportRouteBase {
  children?: never;
  verbiage: ReportPageVerbiage;
}

export interface StandardReportPageShape extends ReportPageShapeBase {
  form: FormJson;
  dashboard?: never;
  modalForm?: never;
  overlayForm?: never;
  drawerForm?: never;
  addEntityDrawerForm?: never;
  entityType?: never;
}

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  addEntityDrawerForm?: FormJson;
  modalForm?: never;
  overlayForm?: never;
  form?: never;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  addEntityDrawerForm?: never;
  overlayForm?: never;
  form?: never;
}

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  addEntityDrawerForm?: never;
  drawerForm?: FormJson;
  entityType: EntityType;
  form?: never;
  modalForm: FormJson;
  overlayForm?: FormJson;
  verbiage: ModalOverlayReportPageVerbiage;
}

export interface EntityDetailsMultiformShape {
  form: FormJson;
  table?: {
    caption: string;
    bodyRows: string[][];
    headRow: Array<string | ScreenReaderCustomHeaderName>;
  };
  verbiage?: EntityDetailsMultiformVerbiage;
}

export interface EntityDetailsTableVerbiage extends EntityDetailsMultiformVerbiage {
  totals?: {
    exceptions?: string;
    nonCompliant?: string;
  };
}

export interface EntityDetailsTableContentShape extends TableContentShape {
  verbiage: EntityDetailsTableVerbiage;
}

export interface EntityDetailsChildFormShape {
  form: FormJson;
  parentForm: string;
  table?: EntityDetailsTableContentShape;
  verbiage?: EntityDetailsMultiformVerbiage;
}

export interface OverlayReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: OverlayReportPageVerbiage;
  overlayForm?: FormJson;
  modalForm?: never;
  drawerForm?: never;
  addEntityDrawerForm?: never;
  form?: never;
  details?: {
    childForms?: EntityDetailsChildFormShape[];
    forms: EntityDetailsMultiformShape[];
    verbiage: EntityDetailsMultiformVerbiage;
  };
}

export interface ReportRouteWithoutForm extends ReportRouteBase {
  children?: ReportRoute[];
  pageType?: string;
  entityType?: never;
  verbiage?: never;
  modalForm?: never;
  overlayForm?: never;
  drawerForm?: never;
  addEntityDrawerForm?: never;
  form?: never;
}

// REPORT VERBIAGE

export interface ReportPageVerbiage {
  intro: {
    alert?: string;
    hint?: string;
    section: string;
    subsection?: string;
    spreadsheet?: string;
    info?: string | CustomHtmlElement[];
    exportSectionHeader?: string;
  };
  praDisclosure?: CustomHtmlElement[];
}

export interface DrawerReportPageVerbiage extends ReportPageVerbiage {
  dashboardTitle: string;
  countEntitiesInTitle?: boolean;
  drawerTitle: string;
  addEntityButtonText?: string;
  drawerInfo?: CustomHtmlElement[];
  missingEntityMessage?: CustomHtmlElement[];
  missingIlosMessage?: CustomHtmlElement[];
  missingPlansAndIlosMessage?: CustomHtmlElement[];
}

export interface ModalDrawerReportPageVerbiage extends DrawerReportPageVerbiage {
  addEntityButtonText: string;
  missingReportingPeriodMessage: string;
  editEntityButtonText: string;
  addEditModalAddTitle: string;
  addEditModalEditTitle: string;
  addEditModalMessage: string;
  deleteEntityButtonAltText: string;
  deleteModalTitle: string;
  deleteModalConfirmButtonText: string;
  deleteModalWarning: string;
  entityUnfinishedMessage: string;
  enterEntityDetailsButtonText: string;
  editEntityDetailsButtonText: string;
}

export interface ModalOverlayReportPageVerbiage extends ReportPageVerbiage {
  addEntityButtonText: string;
  dashboardTitle: string;
  countEntitiesInTitle: boolean;
  tableHeader: string;
  addEditModalHint: string;
  emptyDashboardText: string;
  drawerTitle?: string;
}

export interface OverlayReportPageVerbiage extends ReportPageVerbiage {
  requiredMessages: {
    [key: string]: CustomHtmlElement[] | undefined;
  };
  tableHeader: string;
  emptyDashboardText: string;
  enterEntityDetailsButtonText: string;
}

export interface EntityDetailsMultiformVerbiage extends ReportPageVerbiage {
  backButton?: string;
  heading?: string;
  hint?: string;
  accordion?: {
    buttonLabel: string;
    text: string;
  };
}

// REPORT METADATA

export interface ReportMetadata {
  reportType: string;
  submittedBy?: string;
  createdAt: number;
  lastAltered: number;
  state: State;
  id: string;
  submittedOnDate?: number;
  submissionDates?: { fieldDataId: string; dateSubmitted: number }[];
  fieldDataId: string;
  formTemplateId: string;
  lastAlteredBy: string;
  status: string;
  isComplete: boolean;
  completionStatus?: CompletionData;
  previousRevisions: string[];
  submissionCount: number;
  locked: boolean;
  archived?: boolean;
}

export interface MLRReportMetadata extends ReportMetadata {
  reportType: "MLR";
  submissionName: string;
}

export interface MCPARReportMetadata extends ReportMetadata {
  programName: string;
  reportType: "MCPAR";
  reportingPeriodStartDate: number;
  reportingPeriodEndDate: number;
  dueDate: number;
  combinedData: boolean;
  programIsPCCM: Choice[];
  newOrExistingProgram: Choice[];
  naaarSubmissionForThisProgram: Choice[];
  existingProgramNameSelection?: SelectedOption;
  existingProgramNameSuggestion?: string;
  newProgramName?: string;
  naaarSubmissionDateForThisProgram?: string;
  naaarExpectedSubmissionDateForThisProgram?: string;
  newQualityMeasuresSectionEnabled?: boolean;
}

export interface NAAARReportMetadata extends ReportMetadata {
  programName: string;
  reportType: "NAAAR";
  reportingPeriodStartDate: number;
  reportingPeriodEndDate: number;
  dueDate: number;
  planTypeIncludedInProgram: Choice[];
  "planTypeIncludedInProgram-otherText"?: string;
}

// HELPER FUNCTIONS

/**
 * Check if unknown value is a report type
 *
 * @param reportType possible report type value
 * @returns type assertion for value
 */
export function isReportType(reportType: unknown): reportType is ReportType {
  return Object.values(ReportType).includes(reportType as ReportType);
}

export function pageHasOverlay(
  unknownPage: ReportPageShapeBase
): unknownPage is ModalOverlayReportPageShape {
  return Object.getOwnPropertyNames(unknownPage).includes("overlayForm");
}
