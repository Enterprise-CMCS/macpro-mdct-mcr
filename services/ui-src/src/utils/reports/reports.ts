import { mapValidationTypesToSchema } from "../../utils/validation/validation";
import { AnyObject, ReportShape, ReportJson, ReportRoute } from "types";

// returns reportJson with forms that mirror the adminDisabled status of the report
export const copyAdminDisabledStatusToForms = (
  reportJson: ReportJson
): ReportJson => {
  const reportAdminDisabledStatus = !!reportJson.adminDisabled;
  const writeAdminDisabledStatus = (routes: ReportRoute[]) => {
    routes.forEach((route: ReportRoute) => {
      // if children, recurse
      if (route?.children) {
        writeAdminDisabledStatus(route.children);
      }
      // else if form (children & form are always mutually exclusive)
      else if (route?.form) {
        // copy adminDisabled status to form
        route.form.adminDisabled = reportAdminDisabledStatus;
      }
    });
  };
  writeAdminDisabledStatus(reportJson.routes);
  return reportJson;
};

// returns flattened array of valid routes for given reportJson
export const flattenReportRoutesArray = (
  reportJson: ReportRoute[]
): ReportRoute[] => {
  const routesArray: ReportRoute[] = [];
  const mapRoutesToArray = (reportRoutes: ReportRoute[]) => {
    reportRoutes.map((route: ReportRoute) => {
      // if children, recurse; if none, push to routes array
      if (route?.children) {
        mapRoutesToArray(route.children);
      } else {
        routesArray.push(route);
      }
    });
  };
  mapRoutesToArray(reportJson);
  return routesArray;
};

// update formJson of each report route with appropriate validation schema
export const addValidationSchemaToNestedForms = (
  reportJson: ReportRoute[],
  validationSchema: AnyObject
): ReportRoute[] => {
  const mapSchemaToForms = (routes: ReportRoute[], schema: AnyObject) => {
    routes.map((route: ReportRoute) => {
      // if children, recurse; if none, push to routes array
      if (route?.children) {
        mapSchemaToForms(route.children, validationSchema);
      }
      // else if form (children & form are always mutually exclusive)
      else if (route?.form) {
        const mappedValidationSchema = mapValidationTypesToSchema(
          schema[route.form.id]
        );
        route.form.validation = mappedValidationSchema || {};
      }
    });
  };
  mapSchemaToForms(reportJson, validationSchema);
  return reportJson;
};

export const flattenValidationSchema = (
  nestedValidationSchema: AnyObject
): AnyObject => {
  let validationSchema: AnyObject = {};
  Object.values(nestedValidationSchema).forEach((form: AnyObject) => {
    Object.keys(form).forEach((fieldKey: string) => {
      validationSchema[fieldKey] = form[fieldKey];
    });
  });
  return validationSchema;
};

export const sortReportsOldestToNewest = (
  reportsArray: ReportShape[]
): ReportShape[] =>
  reportsArray.sort((stateA, stateB) => stateA.createdAt - stateB.createdAt);
