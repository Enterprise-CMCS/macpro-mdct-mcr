import rawReportJson from "./mcpar.json";
import rawReportSchema from "./mcpar.schema";
// utils
import {
  addValidationSchemaToNestedForms,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
  flattenValidationSchema,
} from "utils/reports/reports";
import { ReportJson } from "types";

const flattenedRawValidationSchema = flattenValidationSchema(rawReportSchema);

const reportJsonWithDisabledStatus: ReportJson =
  copyAdminDisabledStatusToForms(rawReportJson);

// full reportJson with routes in nested array
export const mcparReportJsonNested: ReportJson = {
  ...rawReportJson,
  // update formJson of each report route with appropriate validation schema
  routes: addValidationSchemaToNestedForms(
    reportJsonWithDisabledStatus.routes,
    rawReportSchema
  ),
  validationSchema: flattenedRawValidationSchema,
};

// full reportJson with routes in flattened array
export const mcparReportJsonFlat: ReportJson = {
  ...rawReportJson,
  routes: flattenReportRoutesArray(mcparReportJsonNested.routes),
  validationSchema: flattenedRawValidationSchema,
};

export const nonFormPages = ["/mcpar/get-started"];
export const isMcparReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
