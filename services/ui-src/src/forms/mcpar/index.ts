import rawReportJson from "./mcpar.json";
// utils
import {
  compileValidationJsonFromRoutes,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
} from "utils/reports/reports";
import { ReportJson } from "types";

const reportJsonBase: ReportJson =
  copyAdminDisabledStatusToForms(rawReportJson);
const mcparReportRoutesFlat = flattenReportRoutesArray(reportJsonBase.routes);

// export full reportJson with validation and flattened routes
export const mcparReportJson = {
  ...reportJsonBase,
  flatRoutes: mcparReportRoutesFlat,
  validationJson: compileValidationJsonFromRoutes(mcparReportRoutesFlat),
};

export const nonFormPages = ["/mcpar/get-started"];
export const isMcparReportFormPage = (pathname: string): boolean =>
  pathname.includes("/mcpar/") && !nonFormPages.includes(pathname);
