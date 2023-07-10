import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { MainSkipNav, ReportContext } from "components";
import { ReportContextShape } from "types";

const mainSkipNavOutsideReport = (
  <ReportContext.Provider
    value={
      {
        isReportPage: false,
      } as ReportContextShape
    }
  >
    <MainSkipNav />
  </ReportContext.Provider>
);

const mainSkipNavInsideReport = (
  <ReportContext.Provider
    value={
      {
        isReportPage: true,
      } as ReportContextShape
    }
  >
    <MainSkipNav />
  </ReportContext.Provider>
);

describe("Test MainSkipNav", () => {
  it("should be visible and focusable", async () => {
    render(mainSkipNavOutsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to main content");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  it("should skip to report content when on a report page", async () => {
    render(mainSkipNavInsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to report sidebar");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });
});

describe("Test MainSkipNav accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(mainSkipNavOutsideReport);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
