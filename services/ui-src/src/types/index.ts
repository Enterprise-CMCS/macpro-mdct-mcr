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
  userRole?: string;
  state?: string;
}

export interface UserContextI {
  user?: MCRUser;
  showLocalLogins?: boolean;
  logout: () => Promise<void>;
  loginWithIDM: () => void;
}

// FORMS

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

// FORM

export interface FormField {
  id: string;
  type: string;
  props?: {
    [key: string]: any;
  };
  validation: FormValidation;
  children?: any;
}

export interface FormValidation {
  type: string;
  options?: {
    [key: string]: any;
  };
  errorMessages?: {
    [key: string]: any;
  };
}

export interface FormJson {
  options: {
    mode: string;
    [key: string]: any;
  };
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

export type { IconType } from "react-icons";

export interface AnyObject {
  [key: string]: any;
}

export interface TableContentShape {
  caption: string;
  headRow: string[];
  bodyRows: string[][];
}
