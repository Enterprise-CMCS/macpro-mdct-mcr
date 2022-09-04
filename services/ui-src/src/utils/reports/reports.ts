import { AnyObject, ReportJson, ReportRoute } from "types";
import { convertDateUtcToEt } from "utils/other/time";

// returns flattened array of valid routes for given reportJson
export const flattenReportRoutesArray = (
  reportJson: ReportJson
): ReportJson => {
  const routesArray: ReportJson = [];
  const mapRoutesToArray = (reportRoutes: ReportJson) => {
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
  reportJson: ReportJson,
  validationSchema: AnyObject
): ReportJson => {
  const mapSchemaToForms = (routes: ReportJson, schema: AnyObject) => {
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

export const createReportId = (
  state: string,
  programName: string,
  dueDate: number
) => {
  const programNameWithDashes = programName.replace(/\s/g, "-");
  const dueDateString = convertDateUtcToEt(dueDate)
    .toString()
    .replace(/\//g, "-");
  const reportId = [state, programNameWithDashes, dueDateString].join("_");
  return reportId;
};
