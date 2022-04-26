export type { IconType } from "react-icons";

export enum CoreSetAbbr {
  ACS = "ACS",
  CCS = "CCS",
  CCSM = "CCSM",
  CCSC = "CCSC",
  HHCS = "HHCS",
}

export enum UserRoles {
  ADMIN = "mdctqmr-approver",
  STATE = "mdctqmr-state-user",
  HELP = "mdctqmr-help-desk",
  BO = "mdctqmr-bo-user",
  BOR = "mdctqmr-bor",
}

export enum MeasureStatus {
  COMPLETE = "complete",
  INCOMPLETE = "incomplete",
}

export interface Params {
  state?: string;
  year?: string;
  coreSetId?: CoreSetAbbr;
}

export interface MeasureData<DataType = any> {
  compoundKey: string;
  coreSet: CoreSetAbbr;
  createdAt: number;
  description: string;
  lastAltered: number;
  measure: string;
  state: string;
  status: "incomplete" | "complete" | undefined;
  reporting: "yes" | "no" | null | undefined;
  year: number;
  data: DataType;
}

export enum AutoCompletedMeasures {
  "LBW-CH" = "LBW-CH",
  "LRCD-CH" = "LRCD-CH",
  "PDENT-CH" = "PDENT-CH",
  "NCIDDS-AD" = "NCIDDS-AD",
}

export interface ITerritoryList {
  label: string;
  value: string;
}

export interface StyleObject {
  [key: string]: any;
}
