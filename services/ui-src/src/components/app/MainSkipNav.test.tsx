import { render, screen } from "@testing-library/react";
// components
import { MainSkipNav, ReportContext } from "components";
// types
import { ReportContextShape } from "types";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const mockUseLocation = jest.fn();
jest.mock("react-router", () => ({
  useLocation: () => mockUseLocation(),
}));

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
    mockUseLocation.mockReturnValue({ pathname: "/home" });
    render(mainSkipNavOutsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to main content");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  test("should skip to report content when on a report page", async () => {
    mockUseLocation.mockReturnValue({ pathname: "/report-page" });
    render(mainSkipNavInsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to report sidebar");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  test("should skip to main content when on an export page", async () => {
    mockUseLocation.mockReturnValue({ pathname: "/export" });
    render(mainSkipNavInsideReport);
    const skipNav = document.getElementById("skip-nav-main")!;
    skipNav.focus();

    const skipNavLink = screen.getByText("Skip to main content");
    await expect(skipNavLink).toHaveFocus();
    await expect(skipNavLink).toBeVisible();
  });

  testA11yAct(mainSkipNavOutsideReport);
});
