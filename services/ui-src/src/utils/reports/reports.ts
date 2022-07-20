// TODO: Add types

export const addDataToReportStructure = (
  structure: any,
  reportPageArray: any
) =>
  structure.map((route: any) => {
    if (route.children) {
      // if there are children, call recursively
      addDataToReportStructure(route.children, reportPageArray);
    } else {
      // if no children (is a visitable page), set pagejson if available
      const respectivePageJson = reportPageArray.find(
        (page: any) => page.form.id === route.formId
      );
      route.pageJson = respectivePageJson;
    }
    return route;
  });

export const makeRouteArray = (routeStructure: any): string[] => {
  const reportNavigationOrder: string[] = [];
  const mapRoutesToArray = (structure: any) => {
    structure.map((route: any) => {
      // map through children if any
      route?.children && mapRoutesToArray(route.children);
      // if page should be rendered, push to array
      if (route.formId || route.element) {
        reportNavigationOrder.push(route);
      }
    });
  };
  mapRoutesToArray(routeStructure);
  return reportNavigationOrder;
};
