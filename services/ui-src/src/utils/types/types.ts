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

// BANNER

export interface BannerShape {
  key: string;
  title: string;
  description: string;
  link?: string;
  startDate: number;
  endDate: number;
}

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}
