import { render, screen } from "@testing-library/react";
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
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockUseParams = jest.fn().mockReturnValue({
  reportType: "mockReportType",
  state: "mockState",
  reportId: "mockReportId",
  pageId: "mock-route-1",
});

const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation(),
  useParams: () => mockUseParams(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockUrls = {
  standard: { pathname: "/report/MCPAR/CO/myReport/mock-route-1" },
  drawer: { pathname: "/report/MCPAR/CO/myReport/mock-route-2a" },
  modalDrawer: { pathname: "/report/MCPAR/CO/myReport/mock-route-2b" },
  modalOverlay: { pathname: "/report/MCPAR/CO/myReport/mock-route-2c" },
  reviewSubmit: {
    pathname: "/report/MCPAR/CO/myReport/mock-review-and-submit",
  },
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
      mockUseLocation.mockReturnValue(mockUrls.standard);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
      ).toBeVisible();
    });

    test("ReportPageWrapper DrawerSection view renders", () => {
      mockUseLocation.mockReturnValue(mockUrls.drawer);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
      ).toBeVisible();
    });

    test("ReportPageWrapper ModalDrawerReportPage view renders", () => {
      mockUseLocation.mockReturnValue(mockUrls.modalDrawer);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(
          mockModalDrawerReportPageJson.verbiage.addEntityButtonText
        )
      ).toBeVisible();
    });

    test("ReportPageWrapper ModalOverlayReportPage view renders", () => {
      mockUseLocation.mockReturnValue(mockUrls.modalOverlay);
      render(ReportPageWrapperComponent);
      expect(
        screen.getByText(
          mockModalOverlayReportPageWithOverlayJson.verbiage.intro.section
        )
      ).toBeVisible();
    });

    test("ReportPageWrapper ReviewSubmitPage view renders", () => {
      mockUseLocation.mockReturnValue(mockUrls.reviewSubmit);
      render(ReportPageWrapperComponent);
      expect(screen.getByTestId("review-submit-page")).toBeVisible();
    });
  });

  describe("Test ReportPageWrapper functionality", () => {
    afterEach(() => jest.clearAllMocks());

    test("ReportPageWrapper navigates to dashboard if no report", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockUseLocation.mockReturnValue(mockUrls.standard);
      render(ReportPageWrapper_WithoutReport);
      expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });

    test("ReportPageWrapper doesn't display report if no matching report route template", () => {
      mockUseLocation.mockReturnValue({ pathname: "" });
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

  testA11yAct(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockUrls.standard);
  });
  testA11yAct(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockUrls.drawer);
  });
  testA11yAct(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockUrls.modalDrawer);
  });
  testA11yAct(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockUrls.modalOverlay);
  });
  testA11yAct(ReportPageWrapperComponent, () => {
    mockUseLocation.mockReturnValue(mockUrls.reviewSubmit);
  });
});
