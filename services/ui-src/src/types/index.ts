import React from "react";

// USERS

export enum UserRoles {
  ADMIN = "mdctmcr-bor", // "MDCT MCR Business Owner Representative"
  HELP_DESK = "mdctmcr-help-desk", // "MDCT MCR Help Desk"
  APPROVER = "mdctmcr-approver", // "MDCT MCR Approver"
  STATE_REP = "mdctmcr-state-rep", // "MDCT MCR State Representative"
  STATE_USER = "mdctmcr-state-user", // "MDCT MCR State User"
}

export interface MCRUser {
  email: string;
  given_name: string;
  family_name: string;
  full_name: string;
  state?: string;
  userRole?: string;
  userIsAdmin?: boolean;
  userIsHelpDeskUser?: boolean;
  userIsApprover?: boolean;
  userIsStateRep?: boolean;
  userIsStateUser?: boolean;
}

export interface UserContextShape {
  user?: MCRUser;
  showLocalLogins?: boolean;
  logout: () => Promise<void>;
  loginWithIDM: () => void;
  updateTimeout: () => void;
  getExpiration: Function;
}

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
    subsection: string;
    spreadsheet?: string;
    info?: string | AnyObject[];
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
  state: string;
  id: string;
}

export interface DashboardReportShape extends ReportKeys {
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
  formTemplate?: ReportJson;
  fieldData?: AnyObject;
  archived?: boolean;
}
export interface ReportShape extends DashboardReportShape {
  formTemplate: ReportJson;
  fieldData: AnyObject;
}

export interface ReportContextMethods {
  fetchReport: Function;
  fetchReportsByState: Function;
  createReport: Function;
  updateReport: Function;
  clearReportSelection: Function;
  setReportSelection: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  report: ReportShape | undefined;
  reportsByState: DashboardReportShape[] | undefined;
  errorMessage?: string | undefined;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

// FORM & FIELD STRUCTURE

export declare type EntityType =
  | "plans"
  | "bssEntities"
  | "accessMeasures"
  | "qualityMeasures"
  | "sanctions";

export enum ModalDrawerEntityTypes {
  ACCESS_MEASURES = "accessMeasures",
  QUALITY_MEASURES = "qualityMeasures",
  SANCTIONS = "sanctions",
}

export interface EntityShape {
  id: string;
  [key: string]: any;
}

export interface FormJson {
  id: string;
  fields: FormField[];
  options?: AnyObject;
  validation?: AnyObject;
  adminDisabled?: boolean;
}

export interface DependentFieldValidation {
  type: string;
  dependentFieldName: string;
  parentOptionId?: never;
}

export interface NestedFieldValidation {
  type: string;
  nested: true;
  parentFieldName: string;
  parentOptionId: string;
}

export interface NestedDependentFieldValidation {
  type: string;
  dependentFieldName: string;
  nested: true;
  parentFieldName: string;
  parentOptionId: string;
}

export type FieldValidationObject =
  | DependentFieldValidation
  | NestedFieldValidation
  | NestedDependentFieldValidation;

export interface FormField {
  id: string;
  type: string;
  validation: string | FieldValidationObject;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
  repeat?: string;
}

export interface DropdownOptions {
  label: string;
  value: string;
}

export interface FieldChoice {
  id: string;
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  children?: FormField[];
  checkedChildren?: React.ReactNode;
}

export interface ChoiceFieldProps {
  name: string;
  label: string;
  choices: FieldChoice[];
  sxOverride?: AnyObject;
  [key: string]: any;
}
export interface Choice {
  key: string; // choice.name
  value: string; // choice.value
}

export interface DropdownChoice {
  label: string;
  value: string;
}

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  REVIEW_SUBMIT = "reviewSubmit",
}

// BANNER

export interface BannerData {
  title: string;
  description: string;
  link?: string;
  [key: string]: any;
}

export interface AdminBannerData extends BannerData {
  key: string;
  startDate: number;
  endDate: number;
  isActive?: boolean;
}

export interface AdminBannerMethods {
  fetchAdminBanner: Function;
  writeAdminBanner: Function;
  deleteAdminBanner: Function;
}

export interface AdminBannerShape extends AdminBannerMethods {
  bannerData?: AdminBannerData;
  isLoading: boolean;
  errorMessage?: string;
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
