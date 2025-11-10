import {
  AnyObject,
  Choice,
  CompletionData,
  CustomHtmlElement,
  EntityType,
  FormJson,
  ScreenReaderCustomHeaderName,
  SelectedOption,
  SortableHeadRow,
  State,
  TableContentShape,
} from "types";

// REPORT TYPES
export enum ReportType {
  MCPAR = "MCPAR",
  MLR = "MLR",
  NAAAR = "NAAAR",
}

// REPORT TEMPLATES
export const TemplateKeys: { [key: string]: string } = {
  MCPAR: "/templates/mcpar-reporting-template.xlsx",
  MLR: "/templates/mlr-reporting-template.xlsx",
  NAAAR: "/templates/naaar-reporting-template.xlsx",
};

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  type?: string;
  name: string;
  basePath: string;
  routes: ReportRoute[];
  flatRoutes?: ReportRoute[];
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
}

export type ReportRouteWithForm =
  | StandardReportPageShape
  | DrawerReportPageShape
  | ModalDrawerReportPageShape
  | ModalOverlayReportPageShape
  | OverlayReportPageShape
  | PlanOverlayReportPageShape;

export interface ReportPageConfig {
  // Display configuration
  entityDisplay?: {
    variant: "rows" | "cards" | "table";
    showCount?: boolean;
    emptyMessage?: string;
  };

  // Editor configuration
  entityEditor?: {
    variant: "drawer" | "overlay" | "modal";
    addForm?: FormJson;
    editForm?: FormJson;
  };

  // Page features
  features?: {
    canAddEntities?: boolean;
    canDeleteEntities?: boolean;
    hideSidebar?: boolean;
    showReportNavigation?: boolean;
  };
}

export interface ReportPageShapeBase extends ReportRouteBase {
  form?: FormJson;
  pageConfig?: ReportPageConfig;
  children?: never;
  verbiage: ReportPageVerbiage;
}

export interface StandardReportPageShape extends ReportPageShapeBase {
  form: FormJson;
  dashboard?: never;
  modalForm?: never;
  overlayForm?: never;
  drawerForm?: never;
  entityType?: never;
}

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  addEntityDrawerForm?: FormJson;
  modalForm?: never;
  overlayForm?: never;
  form?: FormJson;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  overlayForm?: never;
  form?: never;
}

export interface ModalOverlayReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: ModalOverlayReportPageVerbiage;
  modalForm: FormJson;
  overlayForm?: FormJson;
  drawerForm?: never;
  form?: never;
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

export interface EntityDetailsTableVerbiage
  extends EntityDetailsMultiformVerbiage {
  totals?: {
    exceptions?: string;
    nonCompliant?: string;
  };
}

export interface EntityDetailsTableContentShape extends TableContentShape {
  sortableHeadRow: SortableHeadRow;
  verbiage: EntityDetailsTableVerbiage;
}

export interface EntityDetailsChildFormShape {
  form: FormJson;
  parentForm: string;
  table?: {
    caption: string;
    sortableHeadRow: SortableHeadRow;
    verbiage: EntityDetailsTableVerbiage;
  };
  verbiage?: EntityDetailsMultiformVerbiage;
}

export interface OverlayReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: OverlayReportPageVerbiage;
  overlayForm?: FormJson;
  modalForm?: never;
  drawerForm?: never;
  form?: never;
  details?: {
    childForms?: EntityDetailsChildFormShape[];
    forms: EntityDetailsMultiformShape[];
    verbiage: EntityDetailsMultiformVerbiage;
  };
}

export interface PlanOverlayReportPageShape extends ReportPageShapeBase {
  entityType: EntityType;
  verbiage: PlanOverlayReportPageVerbiage;
  overlayForm?: never;
  modalForm?: never;
  drawerForm?: never;
  form?: never;
  details: {
    childForms: EntityDetailsChildFormShape[];
    forms: PlanOverlayDetailsMultiformShape[];
    verbiage: EntityDetailsMultiformVerbiage;
  };
}

export interface PlanOverlayDetailsMultiformShape {
  form: FormJson;
  table: {
    caption: string;
    bodyRows: string[][];
    headRow: Array<string | ScreenReaderCustomHeaderName>;
  };
  verbiage: PlanOverlayMultiformVerbiage;
}

export interface PlanOverlayMultiformVerbiage extends ReportPageVerbiage {
  heading: string;
  hint: string;
  accordion?: {
    buttonLabel: string;
    text: string;
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

export interface ModalDrawerReportPageVerbiage
  extends DrawerReportPageVerbiage {
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
  tableHeader?: string;
}

export interface ModalOverlayReportPageVerbiage extends ReportPageVerbiage {
  addEntityButtonText: string;
  dashboardTitle: string;
  countEntitiesInTitle: boolean;
  tableHeader: string;
  addEditModalHint: string;
  emptyDashboardText: string;
}

export interface OverlayReportPageVerbiage extends ReportPageVerbiage {
  requiredMessages: {
    [key: string]: CustomHtmlElement[] | undefined;
  };
  tableHeader: string;
  emptyDashboardText: string;
  editEntityButtonText: string;
  enterReportText?: string;
  enterEntityDetailsButtonText?: string;
}

export interface PlanOverlayReportPageVerbiage extends ReportPageVerbiage {
  requiredMessages: {
    [key: string]: CustomHtmlElement[] | undefined;
  };
  tableHeader: string;
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
  submissionDates?: { fieldDataId: string; submittedOnDate: number }[];
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

export type ReportMetadataTableVerbiage =
  | McparMetadataHeaders
  | MlrMetadataHeaders
  | NaaarMetadataHeaders;

interface BaseMetadataHeaders {
  lastEdited: string;
  editedBy: string;
  status: string;
}

export interface McparMetadataHeaders extends BaseMetadataHeaders {
  dueDate: string;
}

export interface MlrMetadataHeaders extends BaseMetadataHeaders {
  submissionName: string;
}

export interface NaaarMetadataHeaders extends BaseMetadataHeaders {
  submissionName: string;
  planType: string;
  reportingPeriodStartDate: string;
  reportingPeriodEndDate: string;
}
