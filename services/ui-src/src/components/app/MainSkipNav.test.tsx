import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { MainSkipNav, ReportContext } from "components";
// types
import { ReportContextShape } from "types";
// utils
import { testA11y } from "utils/testing/commonTests";

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

describe("<MainSkipNav />", () => {
  test("should be visible and focusable", async () => {
    render(mainSkipNavOutsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to main content");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  test("should skip to report content when on a report page", async () => {
    render(mainSkipNavInsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to report sidebar");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  testA11y(mainSkipNavOutsideReport);
});
