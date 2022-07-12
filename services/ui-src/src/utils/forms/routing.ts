export const makeNextRoute = (
  pathOrderArray: string[],
  basePath: string,
  currentPath: string
): string => {
  let path = basePath;
  const currentPosition = pathOrderArray.indexOf(currentPath);
  if (currentPosition !== pathOrderArray.length - 1) {
    path += pathOrderArray[currentPosition + 1];
  }
  return path;
};

export const makePreviousRoute = (
  pathOrderArray: string[],
  basePath: string,
  currentPath: string
): string => {
  let path = basePath;
  const currentPosition = pathOrderArray.indexOf(currentPath);
  if (currentPosition) {
    path += pathOrderArray[currentPosition - 1];
  }
  return path;
};
