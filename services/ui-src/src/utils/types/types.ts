import React from "react";

export type { IconType } from "react-icons";

export enum UserRoles {
  ADMIN = "mdctmcr-approver",
  STATE = "mdctmcr-state-user",
  HELP = "mdctmcr-help-desk",
  STATE_REP = "mdctmcr-state-rep",
  BOR = "mdctmcr-bor",
}

export interface ITerritoryList {
  label: string;
  value: string;
}

export interface StyleObject {
  [key: string]: any;
}

export interface JsonObject {
  [key: string]: any;
}

export interface TableContentShape {
  headRow: string[];
  bodyRows: string[][];
}

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
  titleText: string;
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
