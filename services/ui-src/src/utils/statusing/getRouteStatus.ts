export const getRouteStatus = (report: any) => {
  if (!report) return [];

  const {
    formTemplate: { routes },
  } = report;
  const validRoutes = routes.filter((r: any) => r.pageType !== "reviewSubmit");
  const parent = validRoutes.map((route: any) => {
    const children = route.children?.map((child: any) => {
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
        status: child.children
          ? undefined
          : report.completionStatus[route.path][child.path],
        children: grandchildren,
      };
    });

    return {
      name: route.name,
      path: route.path,
      status: children ? undefined : report.completionStatus[route.path],
      children,
    };
  });

  return parent;
};
