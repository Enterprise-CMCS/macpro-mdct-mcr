import { useLocation } from "react-router";

export const useFindRoute = (routeArray: any[], baseRoute: string) => {
  const { pathname } = useLocation();
  let calculatedRoutes = {
    previousRoute: baseRoute,
    nextRoute: baseRoute,
  };
  // find current route and position in array
  const currentRouteObject = routeArray.find(
    (route: any) => route.path === pathname
  );
  const currentPosition = routeArray.indexOf(currentRouteObject);
  if (currentRouteObject) {
    // set previousRoute to previous path || base route
    const previousRoute = routeArray[currentPosition - 1]?.path || baseRoute;
    calculatedRoutes.previousRoute = previousRoute;
    // set nextRoute to next path || base route
    const nextRoute = routeArray[currentPosition + 1]?.path || baseRoute;
    calculatedRoutes.nextRoute = nextRoute;
  }
  return calculatedRoutes;
};
