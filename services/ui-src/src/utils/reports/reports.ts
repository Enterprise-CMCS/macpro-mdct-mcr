import { AnyObject, ReportShape, ReportRoute } from "types";

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
        const correspondingValidationSchema = schema[route.form.id];
        route.form.validation = correspondingValidationSchema || {};
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
