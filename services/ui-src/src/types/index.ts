import React from "react";
import { ArraySchema, StringSchema } from "yup";

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
  userRole?: string;
  state?: string;
}

export interface UserContextI {
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
  version: string;
  routes: ReportRoute[];
}

export type ReportRoute = ReportRouteWithForm | ReportRouteWithChildren;

export interface ReportRouteBase {
  name: string;
  path: string;
  [key: string]: any;
  page?: PageJson;
}

export interface ReportRouteWithForm extends ReportRouteBase {
  children?: never;
}

export interface ReportRouteWithChildren extends ReportRouteBase {
  children?: ReportRoute[];
  form?: never;
}

export interface PageJson {
  intro?: AnyObject;
  drawer?: AnyObject;
  [key: string]: any;
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

// FORM & FIELD STRUCTURE

export interface FormJson {
  id: string;
  fields: FormField[];
  options?: AnyObject;
  validation?: StringSchema | ArraySchema<any> | AnyObject;
}

export interface FormField {
  id: string;
  type: string;
  hydrate?: string;
  props?: AnyObject;
  choices?: FieldChoice[];
}

export interface DropdownOptions {
  label: string;
  value: string;
}

export interface FieldChoice {
  name: string;
  type?: string;
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

// REPORT PROVIDER/CONTEXT

export interface ReportDetails {
  state: string;
  reportId: string;
}

export interface ReportShape extends ReportDetails {
  reportType: string;
  formTemplateId: string;
  programName: string;
  status: string;
  reportingPeriodStartDate: number;
  reportingPeriodEndDate: number;
  dueDate: number;
  createdAt: number;
  lastAltered: number;
  lastAlteredBy: string;
}

export interface ReportDataShape {
  [key: string]: any;
}

export interface ReportContextMethods {
  setReport: Function;
  fetchReport: Function;
  updateReport: Function;
  removeReport: Function;
  setReportData: Function;
  fetchReportData: Function;
  updateReportData: Function;
  fetchReportsByState: Function;
}

export interface ReportContextShape extends ReportContextMethods {
  report: ReportShape | undefined;
  reportData: ReportDataShape | undefined;
  reportsByState: ReportShape[] | undefined;
  errorMessage?: string | undefined;
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
