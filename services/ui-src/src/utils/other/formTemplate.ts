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

import {
  AnyObject,
  FormField,
  isFieldElement,
  ModalOverlayReportPageShape,
  ReportJson,
  ReportRoute,
  ReportType,
} from "types";
import {
  assertExhaustive,
  compileValidationJsonFromFields,
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

// returns reportJson with forms that mirror the adminDisabled status of the report
export const copyAdminDisabledStatusToForms = (
  reportJson: ReportJson
): ReportJson => {
  const reportAdminDisabledStatus = !!reportJson.adminDisabled;
  const writeAdminDisabledStatus = (routes: ReportRoute[]) => {
    routes.forEach((route: ReportRoute) => {
      // if children, recurse (only parent routes have children)
      if (route.children) {
        writeAdminDisabledStatus(route.children);
      } else {
        // else if form present downstream, copy adminDisabled status to form
        if (route.form) route.form.adminDisabled = reportAdminDisabledStatus;
        if (route.drawerForm)
          route.drawerForm.adminDisabled = reportAdminDisabledStatus;
        if (route.modalForm)
          route.modalForm.adminDisabled = reportAdminDisabledStatus;
      }
    });
  };
  writeAdminDisabledStatus(reportJson.routes);
  return reportJson;
};

// traverse routes and compile all field validation schema into one object
export const compileValidationJsonFromRoutes = (
  routeArray: ReportRoute[]
): AnyObject => {
  const validationSchema: AnyObject = {};
  const addValidationToAccumulator = (formFields: FormField[]) => {
    Object.assign(
      validationSchema,
      compileValidationJsonFromFields(formFields)
    );
  };
  routeArray.forEach((route: ReportRoute) => {
    // check for non-standard needed validation objects
    if (
      (route.pageType === "modalDrawer" || route.pageType === "modalOverlay") &&
      route.entityType
    ) {
      Object.assign(validationSchema, { [route.entityType]: "objectArray" });
    }
    // if standard form present, add validation to schema
    const standardFormFields = route.form?.fields.filter(isFieldElement);
    if (standardFormFields) addValidationToAccumulator(standardFormFields);
    // if modal form present, add validation to schema
    const modalFormFields = route.modalForm?.fields.filter(isFieldElement);
    if (modalFormFields) addValidationToAccumulator(modalFormFields);
    // if drawer form present, add validation to schema
    const drawerFormFields = route.drawerForm?.fields.filter(isFieldElement);
    if (drawerFormFields) addValidationToAccumulator(drawerFormFields);
    if (route.pageType === "modalOverlay") {
      const overlayFormFields = (
        route as ModalOverlayReportPageShape
      ).overlayForm?.fields.filter(isFieldElement);
      if (overlayFormFields) addValidationToAccumulator(overlayFormFields);
    }
  });
  return validationSchema;
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
