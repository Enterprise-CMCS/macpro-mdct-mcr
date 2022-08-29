import React from "react";
// USERS

export enum UserRoles {
  ADMIN = "mdctmcr-bor", // "MDCT MCR Business Owner Representative"
  HELP_DESK = "mdctmcr-help-desk", // "MDCTMCR Help Desk"
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

// STATES

export enum States {
  AL = "Alabama",
  AK = "Alaska",
  AZ = "Arizona",
  AR = "Arkansas",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DE = "Delaware",
  DC = "District of Columbia",
  FL = "Florida",
  GA = "Georgia",
  HI = "Hawaii",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  IA = "Iowa",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  ME = "Maine",
  MD = "Maryland",
  MA = "Massachusetts",
  MI = "Michigan",
  MN = "Minnesota",
  MS = "Mississippi",
  MO = "Missouri",
  MT = "Montana",
  NE = "Nebraska",
  NV = "Nevada",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NY = "New York",
  NC = "North Carolina",
  ND = "North Dakota",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VT = "Vermont",
  VA = "Virginia",
  WA = "Washington",
  WV = "West Virginia",
  WI = "Wisconsin",
  WY = "Wyoming",
}

// REPORT

export interface PageJson {
  path: string;
  intro?: AnyObject;
  form: FormJson;
  drawer?: AnyObject;
  [key: string]: any;
}

export interface ReportPath {
  name: string;
  path: string;
  formId?: string;
  element?: string;
  pageJson?: PageJson;
  children?: ReportPath[];
}

export enum ReportStatus {
  CREATED = "Created",
  IN_PROGRESS = "In Progress",
  SUBMITTED = "Submitted",
}

export interface ReportDataShape {
  [key: string]: any;
}

export interface FieldDataShape {
  [key: string]: any;
}

export interface ReportDetails {
  state: string;
  reportId: string;
}

export interface ReportShape {
  [key: string]: any;
}

export interface ReportContextMethods {
  setReport: Function;
  setReportData: Function;
  fetchReportData: Function;
  updateReportData: Function;
  fetchReport: Function;
  updateReport: Function;
  removeReport: Function;
}

export interface ReportContextShape
  extends ReportDataShape,
    ReportShape,
    ReportContextMethods {
  errorMessage?: string;
}

// FORM

export interface FormField {
  id: string;
  type: string;
  hydrate?: string;
  props?: AnyObject;
  validation?: FormValidation;
  choices?: FieldChoice[];
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

export interface FormValidation {
  type: string;
  options?: AnyObject;
  errorMessages?: AnyObject;
}

export interface FormJson {
  id: string;
  options?: AnyObject;
  fields: FormField[];
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

export interface ActionTableContentShape {
  caption?: string;
  headRow?: string[];
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

export interface SpreadsheetWidgetProps {
  title: string;
  descriptionList: string[];
  additionalInfo?: string;
  [key: string]: any;
}
