// types
import { AnyObject, ReportType } from "types";
// dashboard verbiage
import McparDashboardVerbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import MlrDashboardVerbiage from "verbiage/pages/mlr/mlr-dashboard";
import NaaarDashboardVerbiage from "verbiage/pages/naaar/naaar-dashboard";
import Summer2026SansQmNaaarDashboardVerbiage from "verbiage/pages/naaar/flags/summer2026SansQm/naaar-dashboard";
// export verbiage
import McparExportVerbiage from "verbiage/pages/mcpar/mcpar-export";
import MlrExportVerbiage from "verbiage/pages/mlr/mlr-export";
import NaaarExportVerbiage from "verbiage/pages/naaar/naaar-export";
// get started verbiage
import McparGetStartedVerbiage from "verbiage/pages/mcpar/mcpar-get-started";
// quality measures verbiage
import McparQualityMeasuresVerbiage from "verbiage/pages/mcpar/mcpar-quality-measures";
// review and submit verbiage
import McparReviewAndSubmitVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import MlrReviewAndSubmitVerbiage from "verbiage/pages/mlr/mlr-review-and-submit";
import NaaarReviewAndSubmitVerbiage from "verbiage/pages/naaar/naaar-review-and-submit";
import { useFlags } from "launchdarkly-react-client-sdk";

const summer2026SansQm = useFlags()?.summer2026SansQm;

const mcparVerbiage = {
  dashboardVerbiage: McparDashboardVerbiage,
  getStartedVerbiage: McparGetStartedVerbiage,
  qualityMeasuresVerbiage: McparQualityMeasuresVerbiage,
  exportVerbiage: McparExportVerbiage,
  reviewAndSubmitVerbiage: McparReviewAndSubmitVerbiage,
};

const mlrVerbiage = {
  dashboardVerbiage: MlrDashboardVerbiage,
  exportVerbiage: MlrExportVerbiage,
  reviewAndSubmitVerbiage: MlrReviewAndSubmitVerbiage,
};

const naaarVerbiage = {
  dashboardVerbiage: summer2026SansQm
    ? Summer2026SansQmNaaarDashboardVerbiage
    : NaaarDashboardVerbiage,
  exportVerbiage: NaaarExportVerbiage,
  reviewAndSubmitVerbiage: NaaarReviewAndSubmitVerbiage,
};

export const getReportVerbiage = (reportType?: string): AnyObject => {
  const reportTypeSelector =
    reportType ?? localStorage.getItem("selectedReportType");
  switch (reportTypeSelector) {
    case ReportType.MLR:
      return mlrVerbiage;
    case ReportType.NAAAR:
      return naaarVerbiage;
    default:
      return mcparVerbiage;
  }
};
