import { SystemStyleObject } from "@chakra-ui/react";
import React from "react";
import { EntityShape } from "./formFields";

// GLOBAL

export interface AnyObject {
  [key: string]: any;
}

export const enum StatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

// ALERTS

export enum AlertTypes {
  ERROR = "error",
  // INFO = "info",
  SUCCESS = "success",
  WARN = "warn",
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

export interface CustomHtmlElement {
  type: string;
  content: string | any;
  as?: string;
  props?: AnyObject;
  children?: any[];
}

export enum PageTypes {
  STANDARD = "standard",
  DRAWER = "drawer",
  MODAL_DRAWER = "modalDrawer",
  MODAL_OVERLAY = "modalOverlay",
  PLAN_OVERLAY = "planOverlay",
  REVIEW_SUBMIT = "reviewSubmit",
}

export interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

export interface ScreenReaderCustomHeaderName {
  hiddenName: string;
  name?: string;
}

export interface SortableHeadRow {
  [key: string]: {
    header: string;
    admin?: boolean;
    filter?: boolean;
    hidden?: boolean;
    sort?: boolean;
    stateUser?: boolean;
  };
}

export interface TableContentShape {
  caption?: string;
  headRow?: Array<string | ScreenReaderCustomHeaderName>;
  sortableHeadRow?: SortableHeadRow;
  bodyRows?: string[][];
}

export interface NaaarStandardsTableShape {
  id: string;
  count: number;
  provider: string;
  standardType: string;
  description: string;
  analysisMethods: string;
  population: string;
  region: string;
  entity: EntityShape;
  exceptionsNonCompliance?: string;
  edit?: null;
  delete?: null;
  actions?: null;
}

export interface ErrorVerbiage {
  title: string;
  description: string | CustomHtmlElement[];
}

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "DC",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "PR",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;
export type State = typeof states[number];

export type ProgramChoice = {
  id: string;
  label: string;
};

export type ProgramList = {
  [key in State]: ProgramChoice[];
};

// HELPER FUNCTIONS

export const isState = (state: unknown): state is State => {
  return states.includes(state as State);
};

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};

export interface SxObject {
  [key: string]: SystemStyleObject;
}

export interface FaqItem {
  question: string;
  answer: CustomHtmlElement[];
}
