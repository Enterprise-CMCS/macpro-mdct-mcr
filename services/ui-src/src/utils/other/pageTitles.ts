import { ReportPageShapeBase, ReportType } from "types";

export const getPageTitle = (
  reportType: string,
  route: ReportPageShapeBase
) => {
  let pageTitle: string = "";
  switch (reportType) {
    case ReportType.MCPAR:
      // console.log("route", route.pageType)
      const idx = route.name.indexOf(":") + 1;
      const routeName = route.name.substring(idx).trim();
      if (route.path.includes("state-level-indicators")) {
        pageTitle = `State-Level ${routeName}`;
      } else if (route.path.includes("program-level-indicators")) {
        const nestedPaths = [
          "appeals-state-fair-hearings-and-grievances",
          "availability-and-accessibility",
          "bss",
          "mental-health-and-substance-use-disorder-parity",
        ];
        if (nestedPaths.some((path) => route.path.endsWith(path))) {
          pageTitle = routeName;
        } else {
          pageTitle = `Program-Level ${routeName}`;
        }
      } else if (route.path.includes("plan-level-indicators")) {
        const nestedPaths = [
          "program-characteristics",
          "encounter-data-report",
          "program-integrity",
          "prior-authorization",
        ];
        if (nestedPaths.some((path) => route.path.endsWith(path))) {
          pageTitle = `Plan-Level ${routeName}`;
        } else {
          pageTitle = routeName;
        }
      }
  }
  return `${pageTitle} - ${reportType} - MCR`;
};
