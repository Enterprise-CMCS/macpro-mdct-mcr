import { ReportRoute, ReportShape } from "types";

/**
 * This function takes a report and returns an array of objects that represent the status of each route in the report.
 * @param {ReportShape} report
 * @returns {any}
 */
export const getRouteStatus = (report: ReportShape) => {
  const {
    formTemplate: { routes },
  } = report;
  // Filter out the reviewSubmit pageType
  const validRoutes = routes.filter((r: any) => r.pageType !== "reviewSubmit");

  // Get the completion status response from the report
  const completionStatus = report.completionStatus;

  if (!completionStatus) {
    return [];
  }

  /**
   * Recursively goes through every route and its child to find out the completion of each route in a report and create
   * a map
   * @param {ReportRoute[]} routes
   * @param {String[]} path
   * @returns {any}
   */
  const createStatusMap: any = (routes: ReportRoute[], path: string[]) => {
    const list = [];
    const routeLength = routes.length;
    for (let i = 0; i < routeLength; i++) {
      const route = routes[i];
      if (route.children) {
        list.push({
          name: route.name,
          path: route.path,
          children: createStatusMap(route.children, path.concat(route.path)),
        });
      } else {
        const returnobject = {
          name: route.name,
          path: route.path,
          status: getStatus(path.concat(route.path)),
        };
        list.push(returnobject);
      }
    }
    return list;
  };

  /**
   * Look through the completion status in the report and find the status of the path we're looking for
   * @param {String[]} path
   * @returns {any}
   */
  const getStatus = (path: string[]) => {
    let status: any = completionStatus;
    const pathLength = path.length;
    for (let i = 0; i < pathLength; i++) {
      status = status?.[path[i]];
    }
    return status;
  };

  return createStatusMap(validRoutes, []);
};
