import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import {
  mockAdminUserStore,
  mockNoUserStore,
  mockStateUserStore,
  mockMcparReportContext,
  RouterWrappedComponent,
  mockMcparReport,
  mockDashboardReportContext,
  mockReportContextNoReports,
  mockReportContextWithError,
  mockMlrDashboardReportContext,
  mockMcparReportStore,
  mockNaaarReportContext,
  mockLDFlags,
  mockMlrReportStore,
  mockNaaarReportStore,
} from "utils/testing/setupJest";
import { useBreakpoint, makeMediaQueryClasses, useStore } from "utils";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import mlrVerbiage from "verbiage/pages/mlr/mlr-dashboard";
import naaarVerbiage from "verbiage/pages/naaar/naaar-dashboard";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar",
  })),
}));

const dashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardReportContext}>
      <DashboardPage reportType="MCPAR" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mlrDashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrDashboardReportContext}>
      <DashboardPage reportType="MLR" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dashboardViewNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNoReports}>
      <DashboardPage reportType="MCPAR" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dashboardViewWithError = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithError}>
      <DashboardPage reportType="MCPAR" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const naaarDashboardViewEmpty = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockNaaarReportContext}>
      <DashboardPage reportType="NAAAR" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const { report, ...rest } = mockMcparReportStore;

const multiSubmissionCount = {
  ...report,
  submissionCount: 123,
};

const multiSubmissionCountStore = {
  ...rest,
  report: multiSubmissionCount,
  reportsByState: [multiSubmissionCount],
};

const zeroSubmissionCountReport = {
  ...report,
  submissionCount: 0,
};

const zeroSubmissionCountStore = {
  ...rest,
  report: zeroSubmissionCountReport,
  reportsByState: [zeroSubmissionCountReport],
};

const noNameReport = {
  ...report,
};

delete noNameReport.programName;

const noNameReportStore = {
  ...rest,
  report: noNameReport,
  reportsByState: [noNameReport],
};

const noAlteredByReport = {
  ...report,
};

delete noAlteredByReport.lastAlteredBy;

const noAlteredByReportStore = {
  ...rest,
  report: noAlteredByReport,
  reportsByState: [noAlteredByReport],
};

describe("<SortableDashboardTable />", () => {
  describe("Test Report Dashboard with Sortable Table", () => {
    beforeEach(async () => {
      mockLDFlags.set({ sortableDashboardTable: true });
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Check that MCPAR Dashboard view renders", async () => {
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            level: 1,
            name: `Minnesota ${mcparVerbiage.intro.header}`,
          })
        ).toBeVisible();
        expect(
          screen.getAllByRole("gridcell", { name: "testProgram" })[0]
        ).toBeVisible();
        expect(
          screen.queryByText(mcparVerbiage.body.empty)
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
      });
    });

    test("Check that MLR Dashboard view renders", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrReportStore,
      });
      render(mlrDashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            level: 1,
            name: `Minnesota ${mlrVerbiage.intro.header}`,
          })
        ).toBeVisible();
        expect(
          screen.getAllByRole("gridcell", { name: "testSubmission" })[0]
        ).toBeVisible();
        expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
      });
    });

    test("Check that NAAAR Dashboard view renders", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarReportStore,
      });
      render(naaarDashboardViewEmpty);
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            level: 1,
            name: `Minnesota ${naaarVerbiage.intro.header}`,
          })
        ).toBeVisible();
        expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
      });
    });

    test("Clicking 'Edit' button on a report row fetches the field data, then navigates to report", async () => {
      render(dashboardViewWithReports);
      mockMcparReportContext.fetchReport.mockReturnValueOnce(mockMcparReport);
      const enterReportButton = screen.getAllByRole("button", {
        name: "Edit",
      })[0];
      expect(enterReportButton).toBeVisible();
      await userEvent.click(enterReportButton);
      await waitFor(async () => {
        expect(mockMcparReportContext.setReportSelection).toHaveBeenCalledTimes(
          1
        );
        expect(mockUseNavigate).toBeCalledTimes(1);
        expect(mockUseNavigate).toBeCalledWith("/mock/mock-route-1");
      });
    });

    test("Returns empty cell for missing data", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...noNameReportStore,
      });
      const { container } = render(dashboardViewWithReports);
      await waitFor(() => {
        const cells = container.querySelectorAll("td");
        expect(cells[0]).toHaveTextContent("");
      });
    });

    test("Shows submissionCount to admin", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...multiSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.getAllByRole("gridcell", { name: "123" })[0]
        ).toBeVisible();
      });
    });

    test("Shows submissionCount as 1", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...zeroSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(screen.getAllByRole("gridcell", { name: "1" })[0]).toBeVisible();
      });
    });

    test("Hides submissionCount to state user", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...multiSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.queryByRole("gridcell", { name: "123" })
        ).not.toBeInTheDocument();
      });
    });

    test("Shows lastAlteredBy as -", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...noAlteredByReportStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(screen.getAllByText("-")[0]).toBeVisible();
      });
    });
  });

  describe("Test Dashboard with no activeState", () => {
    beforeEach(() => {
      mockLDFlags.set({ sortableDashboardTable: true });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
        isTablet: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });
    test("Dashboard reroutes to / with no active state", async () => {
      mockedUseStore.mockReturnValue(mockNoUserStore);
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(mockUseNavigate).toBeCalledWith("/");
      });
    });
  });

  describe("Test MCPAR Dashboard (without reports)", () => {
    test("MCPAR dashboard renders table with empty text", async () => {
      mockLDFlags.set({ sortableDashboardTable: true });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      mockedUseStore.mockReturnValue(mockStateUserStore);
      render(dashboardViewNoReports);
      await waitFor(() => {
        expect(screen.getByText(mcparVerbiage.body.empty)).toBeVisible();
      });
    });
  });

  describe("Test Dashboard with error", () => {
    test("Error alert shows when there is an error", async () => {
      mockLDFlags.set({ sortableDashboardTable: true });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
        isTablet: false,
      });
      render(dashboardViewWithError);
      await waitFor(() => {
        expect(
          screen.getByText(/Something went wrong on our end/)
        ).toBeVisible();
      });
    });
  });

  describe("Test Dashboard view accessibility", () => {
    it("Should not have basic accessibility issues (desktop)", async () => {
      mockLDFlags.set({ sortableDashboardTable: true });
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      await act(async () => {
        const { container } = render(dashboardViewWithReports);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });
});
