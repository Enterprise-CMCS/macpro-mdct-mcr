// utils
import { flatten } from "utils";
import { ReportPageProgress, ReportRoute, ReportShape } from "types";

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

  // Flatten the completion status to get the pages under each section
  const flattenedStatus = flatten(report.completionStatus, {});

  /**
   * Recursively goes through every route and its child to find out the completion of
   *  each route in a report and create a map
   * @param {ReportRoute[]} routes
   * @returns {ReportPageProgress[]}
   */
  const createStatusMap = (routes: ReportRoute[]): ReportPageProgress[] => {
    const list = [];
    const routeLength = routes.length;
    for (let i = 0; i < routeLength; i++) {
      const route = routes[i];
      if (route.children) {
        const parentRoute: ReportPageProgress = {
          name: route.name,
          path: route.path,
          children: createStatusMap(route.children),
        };
        list.push(parentRoute);
      } else {
        const routeProgress: ReportPageProgress = {
          name: route.name,
          path: route.path,
          status: flattenedStatus[route.path],
        };
        list.push(routeProgress);
      }
    }
    return list;
  };

  return createStatusMap(validRoutes);
};
