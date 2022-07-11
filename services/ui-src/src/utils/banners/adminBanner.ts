export const checkBannerActivityStatus = (
  startDate: string,
  endDate: string
): boolean => {
  const currentTime = new Date().valueOf();
  return currentTime >= parseInt(startDate) && currentTime <= parseInt(endDate);
};
