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
}

// REPORT STRUCTURE

export interface ReportJson {
  id?: string;
  name: string;
  basePath: string;
  adminDisabled?: boolean;
  routes: ReportRoute[];
  validationSchema?: AnyObject;
}

export type ReportRoute = ReportRouteWithForm | ReportRouteWithChildren;

export interface ReportRouteBase {
  name: string;
  path: string;
  page?: PageJson;
  [key: string]: any;
}

export interface ReportRouteWithForm extends ReportRouteBase {
  children?: never;
}

export interface ReportRouteWithChildren extends ReportRouteBase {
  children?: ReportRoute[];
  form?: never;
}

export interface PageJson {
  pageType?: string;
  intro?: AnyObject;
  [key: string]: any;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

// REPORT PROVIDER/CONTEXT

export interface ReportKeys {
  state: string;
  id: string;
}

export interface ReportShape extends ReportKeys {
  reportType: string;
  programName: string;
  status: string;
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
  reportsByState: ReportShape[] | undefined;
  errorMessage?: string | undefined;
}

// FORM & FIELD STRUCTURE

export declare type EntityType = "plans" | "bssEntities";

export interface EntityShape {
  id: string;
  name: string;
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
}

export interface NestedFieldValidation {
  type: string;
  nested: true;
  parentFieldName: string;
  visibleOptionValue: string;
}

export interface NestedDependentFieldValidation {
  type: string;
  dependentFieldName: string;
  nested: true;
  parentFieldName: string;
  visibleOptionValue: string;
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

export enum PageTypes {
  STANDARD = "standard",
  ENTITY_DRAWER = "entityDrawer",
  DYNAMIC_DRAWER = "dynamicDrawer",
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
  bannerData: AdminBannerData;
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
