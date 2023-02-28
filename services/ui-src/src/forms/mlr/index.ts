import rawReportJson from "./mlr.json";
// utils
import {
  compileValidationJsonFromRoutes,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
} from "utils/reports/reports";
import { ReportJson } from "types";

const reportJsonBase: ReportJson =
  copyAdminDisabledStatusToForms(rawReportJson);
const mlrReportRoutesFlat = flattenReportRoutesArray(reportJsonBase.routes);

// export full reportJson with validation and flattened routes
export const mlrReportJson = {
  ...reportJsonBase,
  flatRoutes: mlrReportRoutesFlat,
  validationJson: compileValidationJsonFromRoutes(mlrReportRoutesFlat),
};

export const nonFormPages = ["/mlr/get-started"];
export const isMlrReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mlr/") && !nonFormPages.includes(pathname);
