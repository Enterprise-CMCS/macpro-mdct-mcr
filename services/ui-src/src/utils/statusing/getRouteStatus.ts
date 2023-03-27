// utils
import { AnyObject, ReportPageProgress, ReportRoute, ReportShape } from "types";

/**
 * This function takes a report and returns an array of objects that represent the
 * status of each page in the report.
 * @param {ReportShape} report
 * @returns {ReportPageProgress[]}
 */
export const getRouteStatus = (report: ReportShape): ReportPageProgress[] => {
  const {
    formTemplate: { routes },
  } = report;
  // Filter out the reviewSubmit pageType
  const validRoutes = routes.filter(
    (r: ReportRoute) => r.pageType !== "reviewSubmit"
  );

  // Ensure there is a response from the API containing the completion status
  if (!report.completionStatus) {
    return [];
  }

  /*
   * Takes the completionStatus from the report and flattens it to get each page
   * in the report
   */
  const flatten = (obj: AnyObject, out: AnyObject) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "object") {
        out = flatten(obj[key], out);
      } else {
        out[key] = obj[key];
      }
    });
    return out;
  };

  // Flatten the completion status to get the pages under each section
  const flattenedStatus = flatten(report.completionStatus, {});

  /**
   * Recursively goes through every route and its child to find out the completion of
   * each page in a report and returns the entire forms progress
   * @param {ReportRoute[]} routes
   * @returns {ReportPageProgress[]}
   */
  const createStatusMap = (routes: ReportRoute[]): ReportPageProgress[] => {
    const overallReportProgress = [];
    const routeLength = routes.length;
    for (let i = 0; i < routeLength; i++) {
      const route = routes[i];
      if (route.children) {
        const parentRoute: ReportPageProgress = {
          name: route.name,
          path: route.path,
          children: createStatusMap(route.children),
        };
        overallReportProgress.push(parentRoute);
      } else {
        const routeProgress: ReportPageProgress = {
          name: route.name,
          path: route.path,
          status: flattenedStatus[route.path],
        };
        overallReportProgress.push(routeProgress);
      }
    }
    return overallReportProgress;
  };

  return createStatusMap(validRoutes);
};
