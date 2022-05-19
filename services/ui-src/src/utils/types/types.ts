export type { IconType } from "react-icons";

export enum UserRoles {
  ADMIN = "mdctmcr-approver",
  STATE = "mdctmcr-state-user",
  HELP = "mdctmcr-help-desk",
  STATE_REPRESENTATIVE = "mdctmcr-state-rep",
  BOR = "mdctmcr-bor",
}

export enum BannerTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export interface BannerShape {
  title: string;
  body: string;
  startDate: number;
  endDate: number;
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
