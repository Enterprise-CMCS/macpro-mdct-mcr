// components
import { ReportContext } from "components/reports/ReportProvider";
import { useContext } from "react";
import { SkipNav } from "components";

/**
 * The app's main skip nav changes its target, if we are on a report route.
 *
 * Note this this behavior might not actually matter. It seeems that when
 * there are multiple SkipNav components on the page, the last one takes
 * priority. And when we are on a report page, there will be a second SkipNav,
 * in the sidebar.
 *
 * So it is possible that the conditional logic for isReportPage could be
 * removed, and the SkipNav below could be inlined directly in App.tsx,
 * with no change to the overall behavior of the application.
 */
export const MainSkipNav = () => {
  const { isReportPage } = useContext(ReportContext);

  return (
    <SkipNav
      id="skip-nav-main"
      href={isReportPage ? "#skip-nav-sidebar" : "#main-content"}
      text={`Skip to ${isReportPage ? "report sidebar" : "main content"}`}
      sxOverride={sx.skipnav}
    />
  );
};

const sx = {
  skipnav: {
    position: "absolute",
  },
};
