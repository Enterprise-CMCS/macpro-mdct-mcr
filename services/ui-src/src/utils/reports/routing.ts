export const makeNextRoute = (
  pathOrderArray: string[],
  currentPath: string
): string => {
  const currentPosition = pathOrderArray.indexOf(currentPath);
  return currentPosition ? pathOrderArray[currentPosition + 1] : "";
};

export const makePreviousRoute = (
  pathOrderArray: string[],
  currentPath: string
): string => {
  const currentPosition = pathOrderArray.indexOf(currentPath);
  return currentPosition ? pathOrderArray[currentPosition - 1] : "";
};
