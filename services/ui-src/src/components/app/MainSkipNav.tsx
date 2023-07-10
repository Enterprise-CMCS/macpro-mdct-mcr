// components
import { ReportContext } from "components/reports/ReportProvider";
import { useContext } from "react";
import { SkipNav } from "components";

/**
 * The app's main skip nav changes its target, if we are on a report route.
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
