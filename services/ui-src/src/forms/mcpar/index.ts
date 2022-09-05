import rawReportJson from "./mcpar.json";
import reportSchema from "./mcpar.schema";
// utils
import {
  addValidationToReportJson,
  flattenReportRoutesArray,
} from "utils/reports/reports";
import { ReportJson } from "types";

// full reportJson with routes in nested array
export const mcparReportJsonNested: ReportJson = {
  ...rawReportJson,
  // update the formJson of each report route with appropriate validation schema
  routes: addValidationToReportJson(rawReportJson.routes, reportSchema),
};

// full reportJson with routes in flattened array
export const mcparReportJsonFlat: ReportJson = {
  ...rawReportJson,
  routes: flattenReportRoutesArray(mcparReportJsonNested.routes),
};

export const nonFormPages = ["/mcpar/dashboard", "/mcpar/get-started"];
export const isMcparReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
