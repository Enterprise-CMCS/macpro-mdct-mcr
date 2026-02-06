import { useLocation } from "react-router";
import { ReportRoute, ReportType } from "types";
import {
  removeReportSpecificPath,
  uriPathToPagePath as urlPathToPagePath,
} from "./pathFormatter";

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
  fallbackRoute: string = ""
) => {
  const { pathname } = useLocation();
  const currentPath = urlPathToPagePath(pathname);
  let calculatedRoutes = {
    previousRoute: fallbackRoute,
    nextRoute: fallbackRoute,
  };

  if (flatRouteArray) {
    // find current route and position in array
    const currentRouteObject = flatRouteArray.find(
      (route: ReportRoute) =>
        removeReportSpecificPath(route.path) === currentPath
    );
    if (currentRouteObject) {
      const currentPosition = flatRouteArray.indexOf(currentRouteObject);
      // set previousRoute to previous path or fallback route
      const previousRoute =
        flatRouteArray[currentPosition - 1]?.path || fallbackRoute;

      calculatedRoutes.previousRoute = removeReportSpecificPath(previousRoute);
      // set nextRoute to next path or fallback route
      const nextRoute =
        flatRouteArray[currentPosition + 1]?.path || fallbackRoute;
      calculatedRoutes.nextRoute = removeReportSpecificPath(nextRoute);
    }
  }
  return calculatedRoutes;
};
