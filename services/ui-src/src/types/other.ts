import React from "react";
import { FormJson } from "./formFields";

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  type?: string;
  name: string;
  basePath: string;
  adminDisabled?: boolean;
  routes: ReportRoute[];
  flatRoutes?: ReportRoute[];
  validationSchema?: AnyObject;
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
  | ModalDrawerReportPageShape;

export interface ReportPageShapeBase extends ReportRouteBase {
  children?: never;
  verbiage: ReportPageVerbiage;
}

export interface StandardReportPageShape extends ReportPageShapeBase {
  form: FormJson;
  dashboard?: never;
  modalForm?: never;
  drawerForm?: never;
  entityType?: never;
}

export interface DrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: DrawerReportPageVerbiage;
  drawerForm: FormJson;
  modalForm?: never;
  form?: never;
}

export interface ModalDrawerReportPageShape extends ReportPageShapeBase {
  entityType: string;
  verbiage: ModalDrawerReportPageVerbiage;
  modalForm: FormJson;
  drawerForm: FormJson;
  form?: never;
}

export interface ReportRouteWithoutForm extends ReportRouteBase {
  children?: ReportRoute[];
  pageType?: string;
  entityType?: never;
  verbiage?: never;
  modalForm?: never;
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
  locked?: boolean;
}

export interface ReportShape extends ReportMetadataShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
}

export interface ReportContextMethods {
  fetchReport: Function;
  fetchReportsByState: Function;
  archiveReport: Function;
  unlockReport?: Function;
  createReport: Function;
  updateReport: Function;
  clearReportSelection: Function;
  setReportSelection: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  report: ReportShape | undefined;
  reportsByState: ReportMetadataShape[] | undefined;
  errorMessage?: string | undefined;
  lastSavedTime?: string | undefined;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

// OTHER

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  REVIEW_SUBMIT = "reviewSubmit",
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
export interface AnyObject {
  [key: string]: any;
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

export type { IconType } from "react-icons";

export interface TableContentShape {
  caption?: string;
  headRow?: string[];
  bodyRows?: string[][];
}

export interface CustomHtmlElement {
  type: string;
  content: string | any;
  as?: string;
  props?: AnyObject;
}
