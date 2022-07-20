export const findRoute = (
  routeArray: any[],
  currentPath: string,
  direction: "previous" | "next",
  homePath: string
): string => {
  let path = homePath;
  // find current route and position in array
  const currentRouteObject = routeArray.find(
    (route: any) => route.path === currentPath
  );
  const currentPosition = routeArray.indexOf(currentRouteObject);

  if (direction === "previous") {
    const previousRoutePath = routeArray[currentPosition - 1].path;
    path = currentPosition && previousRoutePath;
  }
  if (direction === "next") {
    const nextRoutePath = routeArray[currentPosition + 1].path;
    path = currentPosition !== routeArray.length - 1 && nextRoutePath;
  }
  return path;
};
