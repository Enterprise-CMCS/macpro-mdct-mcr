// Description: This function takes a report and returns an array of objects that represent the status of each route in the report.
export const getRouteStatus = (report: any) => {
  //TODO: make this a recursive function
  if (!report) return [];

  const {
    formTemplate: { routes },
  } = report;
  // Filter out the reviewSubmit pageType
  const validRoutes = routes.filter((r: any) => r.pageType !== "reviewSubmit");
  // Map over the validRoutes array and return an array of objects that represent the status of each route in the report.
  const parent = validRoutes.map((route: any) => {
    // If the route has children, map over the children and return an array of objects that represent the status of each child in the report.
    const children = route.children?.map((child: any) => {
      // If the child has grandchildren, map over the grandchildren and return an array of objects that represent the status of each grandchild in the report.
      const grandchildren = child.children?.map((grandchild: any) => {
        return {
          name: grandchild.name,
          path: grandchild.path,
          status:
            report.completionStatus[route.path][child.path][grandchild.path],
        };
      });

      return {
        name: child.name,
        path: child.path,
        // If the route has children, return undefined for the status. Otherwise, return the status of the route.
        status: child.children
          ? undefined
          : report.completionStatus[route.path][child.path],
        children: grandchildren,
      };
    });

    return {
      name: route.name,
      path: route.path,
      // If the route has children, return undefined for the status. Otherwise, return the status of the route.
      status: children ? undefined : report.completionStatus[route.path],
      children,
    };
  });

  return parent;
};
