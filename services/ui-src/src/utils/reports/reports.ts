import { ReportPath, PageJson } from "types";
import { convertDateUtcToEt } from "utils/other/time";

export const addDataToReportStructure = (
  structure: ReportPath[],
  reportPageArray: PageJson[]
): ReportPath[] =>
  structure.map((route: ReportPath) => {
    if (route.children) {
      // if there are children, call recursively
      addDataToReportStructure(route.children, reportPageArray);
    } else {
      // if no children (is a visitable page), set pagejson if available
      const respectivePageJson = reportPageArray.find(
        (page: PageJson) => page.form.id === route.formId
      );
      route.pageJson = respectivePageJson;
    }
    return route;
  });

export const makeRouteArray = (routeStructure: ReportPath[]): ReportPath[] => {
  const reportNavigationOrder: ReportPath[] = [];
  const mapRoutesToArray = (structure: ReportPath[]) => {
    structure.map((route: ReportPath) => {
      route?.children
        ? // if children, map through them
          mapRoutesToArray(route.children)
        : // if none, push to array
          reportNavigationOrder.push(route);
    });
  };
  mapRoutesToArray(routeStructure);
  return reportNavigationOrder;
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
