import { ReportJson, ReportRoute } from "types";
import { convertDateUtcToEt } from "utils/other/time";

// returns flattened array of valid routes for given reportJson
export const makeReportRoutesFlatArray = (
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
