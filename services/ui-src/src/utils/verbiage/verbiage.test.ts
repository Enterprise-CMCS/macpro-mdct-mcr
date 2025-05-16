import { ReportType } from "types";
import { getReportVerbiage } from "./verbiage";
// dashboard verbiage
import McparDashboardVerbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import MlrDashboardVerbiage from "verbiage/pages/mlr/mlr-dashboard";
import NaaarDashboardVerbiage from "verbiage/pages/naaar/naaar-dashboard";
// export verbiage
import McparExportVerbiage from "verbiage/pages/mcpar/mcpar-export";
import MlrExportVerbiage from "verbiage/pages/mlr/mlr-export";
import NaaarExportVerbiage from "verbiage/pages/naaar/naaar-export";
// get started verbiage
import McparGetStartedVerbiage from "verbiage/pages/mcpar/mcpar-get-started";
// review and submit verbiage
import McparReviewAndSubmitVerbiage from "verbiage/pages/mcpar/mcpar-review-and-submit";
import MlrReviewAndSubmitVerbiage from "verbiage/pages/mlr/mlr-review-and-submit";
import NaaarReviewAndSubmitVerbiage from "verbiage/pages/naaar/naaar-review-and-submit";

describe("getReportVerbiage()", () => {
  afterEach(() => {
    localStorage.setItem("selectedReportType", "");
  });
  test("Returns MLR when matching passed report type", () => {
    const { dashboardVerbiage, exportVerbiage, reviewAndSubmitVerbiage } =
      getReportVerbiage(ReportType.MLR);
    expect(dashboardVerbiage.intro.header).toBe(
      MlrDashboardVerbiage.intro.header
    );
    expect(exportVerbiage.metadata.subject).toBe(
      MlrExportVerbiage.metadata.subject
    );
    expect(reviewAndSubmitVerbiage.print.printPageUrl).toBe(
      MlrReviewAndSubmitVerbiage.print.printPageUrl
    );
  });

  test("Returns MLR when matching stored report type", () => {
    localStorage.setItem("selectedReportType", ReportType.MLR);
    const { dashboardVerbiage, exportVerbiage, reviewAndSubmitVerbiage } =
      getReportVerbiage();
    expect(dashboardVerbiage.intro.header).toBe(
      MlrDashboardVerbiage.intro.header
    );
    expect(exportVerbiage.metadata.subject).toBe(
      MlrExportVerbiage.metadata.subject
    );
    expect(reviewAndSubmitVerbiage.print.printPageUrl).toBe(
      MlrReviewAndSubmitVerbiage.print.printPageUrl
    );
  });

  test("Returns NAAAR when matching stored report type", () => {
    localStorage.setItem("selectedReportType", ReportType.NAAAR);
    const { dashboardVerbiage, exportVerbiage, reviewAndSubmitVerbiage } =
      getReportVerbiage();
    expect(dashboardVerbiage.intro.header).toBe(
      NaaarDashboardVerbiage.intro.header
    );
    expect(exportVerbiage.metadata.subject).toBe(
      NaaarExportVerbiage.metadata.subject
    );
    expect(reviewAndSubmitVerbiage.print.printPageUrl).toBe(
      NaaarReviewAndSubmitVerbiage.print.printPageUrl
    );
  });

  test("Returns MCPAR when matching stored report type", () => {
    localStorage.setItem("selectedReportType", ReportType.MCPAR);
    const {
      dashboardVerbiage,
      exportVerbiage,
      getStartedVerbiage,
      reviewAndSubmitVerbiage,
    } = getReportVerbiage();
    expect(dashboardVerbiage.intro.header).toBe(
      McparDashboardVerbiage.intro.header
    );
    expect(exportVerbiage.metadata.subject).toBe(
      McparExportVerbiage.metadata.subject
    );
    expect(getStartedVerbiage.intro.header).toBe(
      McparGetStartedVerbiage.intro.header
    );
    expect(reviewAndSubmitVerbiage.print.printPageUrl).toBe(
      McparReviewAndSubmitVerbiage.print.printPageUrl
    );
  });

  test("Returns MCPAR as default", () => {
    localStorage.setItem("selectedReportType", "");
    const {
      dashboardVerbiage,
      exportVerbiage,
      getStartedVerbiage,
      reviewAndSubmitVerbiage,
    } = getReportVerbiage();
    expect(dashboardVerbiage.intro.header).toBe(
      McparDashboardVerbiage.intro.header
    );
    expect(exportVerbiage.metadata.subject).toBe(
      McparExportVerbiage.metadata.subject
    );
    expect(getStartedVerbiage.intro.header).toBe(
      McparGetStartedVerbiage.intro.header
    );
    expect(reviewAndSubmitVerbiage.print.printPageUrl).toBe(
      McparReviewAndSubmitVerbiage.print.printPageUrl
    );
  });
});
