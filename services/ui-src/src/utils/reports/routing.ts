import { useLocation } from "react-router-dom";
import {
  isMcparReportFormPage,
  /*
   * mcparReportJson,
   * mcparReportRoutesFlat,
   */
} from "forms/mcpar";
import { ReportRoute } from "types";

// TODO: Chain future reports here
export const isReportFormPage = (pathname: string): boolean =>
  isMcparReportFormPage(pathname);

// eslint-disable-next-line multiline-comment-style
// // TODO: Add future reports here
// const getRoutingStructure = (pathname: string) => {
//   if (isMcparReportFormPage(pathname)) {
//     return {
//       basePath: mcparReportJson.basePath,
//       reportJson: mcparReportJson,
//       reportRoutesFlat: mcparReportRoutesFlat,
//     };
//   }
//   return { basePath: "/", reportJson: undefined, reportRoutesFlat: undefined };
// };

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
