/*
 * NOTE TO REVIEWERS: This file is temporary.
 * We want the UI to be completely unaware of form templates,
 * except for whatever it can see in the currently-selected report.
 * Prior to this change, the UI had knowledge of the latest form templates
 * in several places.
 * With this change, the only time the UI looks at the latest form template
 * is within the AddEditReportModal, so that it can send that form template
 * to the backend. We are moving form templates to the backend, so soon
 * there will be no reason to do this.
 * As soon as the backend is updated, AddEditReportModal should omit
 * the form template from the report creation payload, and this file
 * should be deleted.
 * In other words, this file exists only as a stepping stone.
 */

import { ReportType } from "types";
import {
  assertExhaustive,
  compileValidationJsonFromRoutes,
  copyAdminDisabledStatusToForms,
  flattenReportRoutesArray,
} from "utils";

import rawMcparJson from "../../forms/mcpar/mcpar.json";
import rawMlrJson from "../../forms/mlr/mlr.json";

const jsonForReportType = (reportType: ReportType) => {
  switch (reportType) {
    case ReportType.MCPAR:
      return rawMcparJson;
    case ReportType.MLR:
      return rawMlrJson;
    case ReportType.NAAAR:
      throw new Error(
        "Not Implemented: NAAAR form template JSON must be added to FormTemplateProvider"
      );
    default:
      assertExhaustive(reportType);
      throw new Error(
        "Not Implemented: ReportType not recognized by FormTemplateProvider"
      );
  }
};

export const getLatestFormTemplate = (reportType: ReportType) => {
  const rawJson = jsonForReportType(reportType);
  const reportJson = copyAdminDisabledStatusToForms(rawJson);
  const flatRoutes = flattenReportRoutesArray(reportJson.routes);
  const validationJson = compileValidationJsonFromRoutes(flatRoutes);

  return {
    ...reportJson,
    validationJson,
  };
};
