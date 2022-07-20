// TODO: Add types

export const addDataToReportStructure = (
  structure: any,
  reportPageArray: any,
  basePath: string
) =>
  structure.map((route: any) => {
    if (route.children) {
      // if there are children, call recursively
      const childBasePath = `${basePath}${route.path}`;
      addDataToReportStructure(route.children, reportPageArray, childBasePath);
      // set first child path as redirect prop for router
      const firstChildPath = `${basePath}${route.path}${route.children[0].path}`;
      route.redirect = firstChildPath;
    } else {
      // if no children, set pagejson if available
      const respectivePageJson = reportPageArray.find(
        (page: any) => page.form.id === route.formId
      );
      route.pageJson = respectivePageJson;
    }
    return route;
  });

export const makeReportNavigationOrder = (
  routeStructure: any,
  basePath: string
): string[] => {
  const reportNavigationOrder: string[] = [basePath];
  const addPathToArray = (route: any, basePath: string) => {
    if (route.formId || route.element) {
      reportNavigationOrder.push(basePath + route.path);
    }
  };
  routeStructure.map((route: any) => {
    if (route.children) {
      route.children.map((childRoute: any) => {
        addPathToArray(childRoute, basePath + route.path);
      });
    }
    addPathToArray(route, basePath);
  });
  return reportNavigationOrder;
};

export const makeNextRoute = (
  pathOrderArray: string[],
  currentPath: string
): string => {
  const currentPosition = pathOrderArray.indexOf(currentPath);
  return currentPosition ? pathOrderArray[currentPosition + 1] : "";
};

export const makePreviousRoute = (
  pathOrderArray: string[],
  currentPath: string
): string => {
  const currentPosition = pathOrderArray.indexOf(currentPath);
  return currentPosition ? pathOrderArray[currentPosition - 1] : "";
};
