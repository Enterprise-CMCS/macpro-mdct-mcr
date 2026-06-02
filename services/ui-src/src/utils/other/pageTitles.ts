import { ReportPageShapeBase, ReportType } from "types";

export const getPageTitle = (
  reportType: string,
  route: ReportPageShapeBase
) => {
  let pageTitle: string = "";
  switch (reportType) {
    case ReportType.MCPAR:
      const idx = route.name.indexOf(":") + 1;
      const routeName = route.name.substring(idx).trim();
      pageTitle = routeName;
      if (route.path.includes("state-level-indicators")) {
        pageTitle = `State-Level ${routeName}`;
      } else if (route.path.includes("program-level-indicators")) {
        const nestedPaths = [
          "appeals-state-fair-hearings-and-grievances",
          "access-measures",
          "bss",
          "mental-health-and-substance-use-disorder-parity",
        ];
        if (!nestedPaths.some((path) => route.path.endsWith(path))) {
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
        }
      }
  }
  return `${pageTitle} - ${reportType} - MCR`;
};
