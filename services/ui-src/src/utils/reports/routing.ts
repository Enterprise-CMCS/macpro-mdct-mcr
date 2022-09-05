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

  if (currentPosition !== -1) {
    if (direction === "previous" && currentPosition !== 0) {
      const previousRoutePath = routeArray[currentPosition - 1]?.path;
      path = previousRoutePath;
    }
    if (direction === "next" && currentPosition !== routeArray.length - 1) {
      const nextRoutePath = routeArray[currentPosition + 1]?.path;
      path = nextRoutePath;
    }
  }

  return path;
};
