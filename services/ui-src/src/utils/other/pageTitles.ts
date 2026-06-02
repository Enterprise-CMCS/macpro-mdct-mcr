import { ReportPageShapeBase, ReportType } from "types";

export const getPageTitle = (
  reportType: string,
  route: ReportPageShapeBase
) => {
  const idx = route.name.search(/[.:]/) + 1;
  const routeName = route.name.substring(idx).trim();
  let pageTitle = routeName;
  switch (reportType) {
    case ReportType.MCPAR:
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
      break;
    default:
      pageTitle = routeName;
      break;
  }
  return `${pageTitle} - ${reportType} - MCR`;
};
