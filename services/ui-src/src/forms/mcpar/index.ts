import rawReportJson from "./mcpar.json";
import reportSchema from "./mcpar.schema";
// utils
import {
  addValidationSchemaToNestedForms,
  flattenReportRoutesArray,
  flattenValidationSchema,
} from "utils/reports/reports";
import { ReportJson } from "types";

const fullReportValidationSchema = flattenValidationSchema(reportSchema);

// full reportJson with routes in nested array
export const mcparReportJsonNested: ReportJson = {
  ...rawReportJson,
  // update formJson of each report route with appropriate validation schema
  routes: addValidationSchemaToNestedForms(rawReportJson.routes, reportSchema),
  validationSchema: { "apoc-a2a": "text", "apoc-a2b": "email" },
};

// full reportJson with routes in flattened array
export const mcparReportJsonFlat: ReportJson = {
  ...rawReportJson,
  routes: flattenReportRoutesArray(mcparReportJsonNested.routes),
  validationSchema: fullReportValidationSchema,
};

export const nonFormPages = ["/mcpar/get-started"];
export const isMcparReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
