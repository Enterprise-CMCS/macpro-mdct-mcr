// TODO: Add types

export const addDataToReportStructure = (
  structure: any,
  reportPageArray: any
) =>
  structure.map((route: any) => {
    if (route.children) {
      // if there are children, call recursively
      addDataToReportStructure(route.children, reportPageArray);
      // set first child path as redirect prop for router
      route.redirect = route.children[0].path;
    } else {
      // if no children (is a visitable page), set pagejson if available
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
  const mapStructureToArray = (structure: any) => {
    structure.map((route: any) => {
      route?.children && mapStructureToArray(route.children);
      if (route.formId || route.element) {
        reportNavigationOrder.push(route.path);
      }
    });
  };
  mapStructureToArray(routeStructure);
  return reportNavigationOrder;
};
