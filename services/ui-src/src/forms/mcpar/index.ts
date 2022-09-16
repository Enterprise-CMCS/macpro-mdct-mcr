import rawReportJson from "./mcpar.json";
// utils
import {
  compileValidationJson,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
} from "utils/reports/reports";
import { ReportJson } from "types";

const reportJsonBase: ReportJson =
  copyAdminDisabledStatusToForms(rawReportJson);

// export routes in flattened array for use in creating app routes
export const mcparReportRoutesFlat = flattenReportRoutesArray(
  reportJsonBase.routes
);

/*
 * export full reportJson with routes in nested array
 * for storage and use in creating form and sidebar
 */
export const mcparReportJson = {
  ...reportJsonBase,
  validationJson: compileValidationJson(mcparReportRoutesFlat),
};

export const nonFormPages = ["/mcpar/get-started"];
export const isMcparReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
