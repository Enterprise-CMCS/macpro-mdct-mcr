import { useLocation } from "react-router-dom";

export const useFindRoute = (routeArray: any[], fallbackRoute: string) => {
  const { pathname } = useLocation();
  let calculatedRoutes = {
    previousRoute: fallbackRoute,
    nextRoute: fallbackRoute,
  };
  // find current route and position in array
  const currentRouteObject = routeArray.find(
    (route: any) => route.path === pathname
  );
  const currentPosition = routeArray.indexOf(currentRouteObject);
  if (currentRouteObject) {
    // set previousRoute to previous path || base route
    const previousRoute =
      routeArray[currentPosition - 1]?.path || fallbackRoute;
    calculatedRoutes.previousRoute = previousRoute;
    // set nextRoute to next path || base route
    const nextRoute = routeArray[currentPosition + 1]?.path || fallbackRoute;
    calculatedRoutes.nextRoute = nextRoute;
  }
  return calculatedRoutes;
};
