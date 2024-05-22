import { Choice, FormJson, ModalOverlayReportPageShape } from "./formFields";
import { AnyObject, CompletionData, CustomHtmlElement, State } from "./other";

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  type?: string;
  name: string;
  basePath: string;
  routes: ReportRoute[];
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
  | ModalOverlayReportPageShape;

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
  entityType?: never;
}

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  modalForm?: never;
  overlayForm?: never;
  form?: never;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  overlayForm?: never;
  form?: never;
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

export interface ReportPageVerbiage {
  intro: {
    section: string;
    subsection?: string;
    spreadsheet?: string;
    info?: string | CustomHtmlElement[];
  };
}

export interface DrawerReportPageVerbiage extends ReportPageVerbiage {
  dashboardTitle: string;
  countEntitiesInTitle?: boolean;
  drawerTitle: string;
  drawerInfo?: CustomHtmlElement[];
  missingEntityMessage?: CustomHtmlElement[];
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
}

export interface ModalOverlayReportPageVerbiage extends ReportPageVerbiage {
  addEntityButtonText: string;
  dashboardTitle: string;
  countEntitiesInTitle: boolean;
  tableHeader: string;
  addEditModalHint: string;
  emptyDashboardText: string;
}

// REPORT METADATA

export interface ReportMetadata {
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
  ilosAvailable?: boolean;
}

export enum ReportType {
  MCPAR = "MCPAR",
  MLR = "MLR",
  NAAAR = "NAAAR",
}
/**
 * Check if unknown value is a report type
 *
 * @param reportType possible report type value
 * @returns type assertion for value
 */
export function isReportType(reportType: unknown): reportType is ReportType {
  return Object.values(ReportType).includes(reportType as ReportType);
}
