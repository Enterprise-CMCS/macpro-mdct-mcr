import { AnyObject, ReportRoute } from "types";

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

export const addValidationToReportJson = (
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
