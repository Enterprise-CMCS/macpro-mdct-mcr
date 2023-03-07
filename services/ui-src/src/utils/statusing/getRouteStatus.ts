// utils
import { flatten } from "utils";
import { ReportRoute, ReportShape } from "types";

/**
 * This function takes a report and returns an array of objects that represent the
 * status of each route in the report.
 * @param {ReportShape} report
 * @returns {any}
 */
export const getRouteStatus = (report: ReportShape) => {
  const {
    formTemplate: { routes },
  } = report;
  // Filter out the reviewSubmit pageType
  const validRoutes = routes.filter((r: any) => r.pageType !== "reviewSubmit");

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
   * @returns {any}
   */
  const createStatusMap: any = (routes: ReportRoute[]) => {
    const list = [];
    const routeLength = routes.length;
    for (let i = 0; i < routeLength; i++) {
      const route = routes[i];
      if (route.children) {
        list.push({
          name: route.name,
          path: route.path,
          children: createStatusMap(route.children),
        });
      } else {
        const returnobject = {
          name: route.name,
          path: route.path,
          status: flattenedStatus[route.path],
        };
        list.push(returnobject);
      }
    }
    return list;
  };

  return createStatusMap(validRoutes);
};
