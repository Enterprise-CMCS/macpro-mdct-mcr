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

export const isMlrReportFormPage = (pathname: string): boolean => {
  let i = 0;
  for (i; i < mlrReportRoutesFlat.length; i++) {
    if (mlrReportRoutesFlat[i].path === pathname) {
      return true;
    }
  }
  return false;
};
