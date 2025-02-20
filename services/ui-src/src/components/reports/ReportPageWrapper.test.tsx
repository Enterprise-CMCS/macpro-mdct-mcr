import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, MockedFunction, test, vi } from "vitest";
import { useLocation, useNavigate, Location } from "react-router-dom";
// components
import { ReportContext, ReportPageWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockMcparReport,
  mockMcparReportContext,
  mockMcparReportStore,
  mockModalDrawerReportPageJson,
  mockModalOverlayReportPageWithOverlayJson,
  mockReportJson,
  mockStandardReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useLocation: vi.fn(),
}));
const mockNavigate = useNavigate() as MockedFunction<typeof useNavigate>;
const mockUseLocation = useLocation as MockedFunction<typeof useLocation>;

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockLocations = {
  standard: { pathname: mockReportJson.flatRoutes[0].path } as Location,
  drawer: { pathname: mockReportJson.flatRoutes[1].path } as Location,
  modalDrawer: { pathname: mockReportJson.flatRoutes[2].path } as Location,
  modalOverlay: { pathname: mockReportJson.flatRoutes[3].path } as Location,
  reviewSubmit: { pathname: mockReportJson.flatRoutes[4].path } as Location,
};

const ReportPageWrapperComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <ReportPageWrapper />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mockedNoReport = {
  ...mockMcparReport,
  id: "",
};
const mockReportContextWithoutReport = {
  ...mockMcparReportContext,
  report: mockedNoReport,
};

const ReportPageWrapper_WithoutReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutReport}>
      <ReportPageWrapper />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ReportPageWrapper />", () => {
  describe("Test ReportPageWrapper view", () => {
    test("ReportPageWrapper StandardFormSection view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.standard);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
      ).toBeVisible();
    });

    test("ReportPageWrapper DrawerSection view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.drawer);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeVisible();
    });

    test("ReportPageWrapper ModalDrawerReportPage view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(
          mockModalDrawerReportPageJson.verbiage.addEntityButtonText
        )
      ).toBeVisible();
    });

    test("ReportPageWrapper ModalOverlayReportPage view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(
          mockModalOverlayReportPageWithOverlayJson.verbiage.intro.section
        )
      ).toBeVisible();
    });

    test("ReportPageWrapper ReviewSubmitPage view renders", () => {
      mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
      render(ReportPageWrapperComponent);
      expect(screen.getByTestId("review-submit-page")).toBeVisible();
    });
  });

  describe("Test ReportPageWrapper functionality", () => {
    afterEach(() => vi.clearAllMocks());

    test("ReportPageWrapper navigates to dashboard if no report", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockUseLocation.mockReturnValue(mockLocations.standard);
      render(ReportPageWrapper_WithoutReport);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("ReportPageWrapper doesn't display report if no matching report route template", () => {
      mockUseLocation.mockReturnValue({ pathname: "" } as Location);
      render(ReportPageWrapperComponent);
      expect(
        screen.queryByText(mockStandardReportPageJson.verbiage.intro.section)
      ).toBeNull();
      expect(
        screen.queryByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeNull();
      expect(
        screen.queryByText(
          mockModalDrawerReportPageJson.verbiage.addEntityButtonText
        )
      ).toBeNull();
      expect(
        screen.queryByText(
          mockModalOverlayReportPageWithOverlayJson.verbiage.intro.section
        )
      ).toBeNull();
      expect(screen.queryByTestId("review-submit-page")).toBeNull();
    });
  });

  testA11y(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockLocations.standard);
  });
  testA11y(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockLocations.drawer);
  });
  testA11y(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockLocations.modalDrawer);
  });
  testA11y(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockLocations.modalOverlay);
  });
  testA11y(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockLocations.reviewSubmit);
  });
});
