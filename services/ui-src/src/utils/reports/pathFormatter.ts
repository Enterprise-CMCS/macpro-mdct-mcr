/**
 * This shim is in place to transform a flatRoute in the style of /mcpar/myPath/place into just myPath/place
 * This allows us to compare against the URL fragments we care about
 */
export const removeReportSpecificPath = (reportTemplatePath: string) => {
  return reportTemplatePath.split("/").slice(2).join("/");
};

/**
 * This shim just gets the trailing path from the url, currently expecting a style like:
 *   /report/MCPAR/MA/myReportId/program-information/point-of-contact
 * and returns
 *   program-information/point-of-contact
 */
export const uriPathToPagePath = (reportTemplatePath: string) => {
  return reportTemplatePath.split("/").slice(5).join("/");
};
