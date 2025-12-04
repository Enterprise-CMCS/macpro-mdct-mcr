import { useContext } from "react";
import { useLocation } from "react-router";
// components
import { ReportContext, SkipNav } from "components";

/**
 * The app's main skip nav changes its target, if we are on a report route.
 *
 * Note this this behavior might not actually matter. It seems that when
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
  const { pathname } = useLocation();
  const isExportPage = pathname.includes("/export");

  const skipSidebarNav = isReportPage && !isExportPage;

  return (
    <SkipNav
      id="skip-nav-main"
      href={skipSidebarNav ? "#skip-nav-sidebar" : "#main-content"}
      text={`Skip to ${skipSidebarNav ? "report sidebar" : "main content"}`}
      sxOverride={sx.skipnav}
    />
  );
};

const sx = {
  skipnav: {
    position: "absolute",
  },
};
