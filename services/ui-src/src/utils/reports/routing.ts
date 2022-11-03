import { useLocation } from "react-router-dom";
import {
  isMcparReportFormPage,
  mcparReportJson,
  mcparReportRoutesFlat,
} from "forms/mcpar";

// TODO: Add future reports here
export const getCurrentReportFormPageType = (
  pathname: string
): string | undefined => {
  let pageType = undefined;
  if (isMcparReportFormPage(pathname)) pageType = "mcpar";
  return pageType;
};

// TODO: Add future reports here
const getRoutingStructure = (pathname: string) => {
  if (isMcparReportFormPage(pathname)) {
    return {
      fallbackRoute: mcparReportJson.basePath,
      routeArray: mcparReportRoutesFlat,
    };
  }
  return { fallbackRoute: "/", routeArray: undefined };
};

export const useFindRoute = () => {
  const { pathname } = useLocation();
  const { fallbackRoute, routeArray } = getRoutingStructure(pathname);
  let calculatedRoutes = {
    previousRoute: fallbackRoute,
    nextRoute: fallbackRoute,
  };
  // find current route and position in array
  if (routeArray) {
    const currentRouteObject = routeArray.find(
      (route: any) => route.path === pathname
    );
    if (currentRouteObject) {
      const currentPosition = routeArray.indexOf(currentRouteObject);
      // set previousRoute to previous path || base route
      const previousRoute =
        routeArray[currentPosition - 1]?.path || fallbackRoute;
      calculatedRoutes.previousRoute = previousRoute;
      // set nextRoute to next path || base route
      const nextRoute = routeArray[currentPosition + 1]?.path || fallbackRoute;
      calculatedRoutes.nextRoute = nextRoute;
    }
  }
  return calculatedRoutes;
};
