import { useLocation } from "react-router";
import {
  DrawerReportPageShape,
  ModalOverlayReportPageShape,
  ReportRoute,
  ReportType,
  StandardReportPageShape,
} from "types";

/**
 * WARNING: You probably want ReportContext.isReportPage instead.
 * This function is called from outside the ReportContext,
 * so it can only make a best guess.
 */
export const isApparentReportPage = (pathname: string): boolean => {
  const yes = Object.values(ReportType).some((reportType) => {
    const prefix = `/${reportType.toLowerCase()}/`;
    /*
     * Report pages look like "/mcpar/some-path", or "/mlr/some-other-path"
     * Two exceptions are the Get Started page, and the root (Dashboard) page for that report type.
     */
    return (
      pathname.startsWith(prefix) &&
      !pathname.startsWith(`/${prefix}/get-started`) &&
      pathname.length > prefix.length
    );
  });
  return yes;
};

export const useFindRoute = (
  flatRouteArray: ReportRoute[] | undefined,
  fallbackRoute: string = "/"
) => {
  const { pathname } = useLocation();
  let calculatedRoutes = {
    previousRoute: fallbackRoute,
    nextRoute: fallbackRoute,
  };
  if (flatRouteArray) {
    // find current route and position in array
    const currentRouteObject = flatRouteArray.find(
      (route: ReportRoute) => route.path === pathname
    );
    if (currentRouteObject) {
      const currentPosition = flatRouteArray.indexOf(currentRouteObject);
      // set previousRoute to previous path or fallback route
      const previousRoute =
        flatRouteArray[currentPosition - 1]?.path || fallbackRoute;
      calculatedRoutes.previousRoute = previousRoute;
      // set nextRoute to next path or fallback route
      const nextRoute =
        flatRouteArray[currentPosition + 1]?.path || fallbackRoute;
      calculatedRoutes.nextRoute = nextRoute;
    }
  }
  return calculatedRoutes;
};

const hasPath = (path: string) => (route: { path: string }) =>
  route.path.includes(path);

const isPath = (path: string) => (route: { path: string }) =>
  route.path === path;

export const routeChecker: RouteChecker = {
  // MCPAR
  isMcpar: hasPath("mcpar"),
  isIlosPage: isPath("/mcpar/plan-level-indicators/ilos"),
  isMeasuresAndResultsPage: isPath(
    "/mcpar/plan-level-indicators/quality-measures/measures-and-results"
  ),
  isNewPlanExemptionPage: isPath(
    "/mcpar/plan-level-indicators/quality-measures/new-plan-exemption"
  ),
  isPatientAccessApiPage: isPath(
    "/mcpar/plan-level-indicators/patient-access-api"
  ),
  isPlanLevelIndicatorsPage: isPath("/mcpar/plan-level-indicators"),
  isPriorAuthorizationPage: isPath(
    "/mcpar/plan-level-indicators/prior-authorization"
  ),
  // NAAAR
  isAnalysisMethodsPage: hasPath("analysis-methods"),
  isStandardsPage: isPath(
    "/naaar/program-level-access-and-network-adequacy-standards"
  ),
};

interface RouteChecker {
  [key: string]: (
    route:
      | DrawerReportPageShape
      | ModalOverlayReportPageShape
      | StandardReportPageShape
  ) => boolean;
}
