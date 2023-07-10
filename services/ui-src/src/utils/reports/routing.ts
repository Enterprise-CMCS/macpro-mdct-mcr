import { useLocation } from "react-router-dom";
import { ReportRoute, ReportType } from "types";

/**
 * WARNING: You probably want ReportContext.isReportPage instead.
 * This function is called from outside the ReportContext,
 * so it can only make a best guess.
 */
export const isApparentReportPage = (pathname: string): boolean => {
  // TODO make this more specific: The report name should be the FIRST part of the path.
  return Object.values(ReportType).some((reportType) =>
    pathname.includes(`/${reportType.toLowerCase()}/`)
  );
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
