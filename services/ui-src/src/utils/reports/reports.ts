import { AnyObject, ReportJson, ReportRoute } from "types";
import { convertDateUtcToEt } from "utils/other/time";

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
        // add corresponding validation schema to form
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

export const sortReportsOldestToNewest = (
  reportsArray: { createdAt: number }[]
) => reportsArray.sort((stateA, stateB) => stateA.createdAt - stateB.createdAt);
