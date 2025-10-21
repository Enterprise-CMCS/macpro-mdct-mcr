import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DashboardPage } from "components";
// utils
import {
  mockAdminUserStore,
  mockHelpDeskUserStore,
  mockInternalUserStore,
  mockStateApproverStore,
  mockNoUserStore,
  mockStateUserStore,
  mockMcparReportContext,
  RouterWrappedComponent,
  mockMcparReport,
  mockDashboardReportContext,
  mockReportContextNoReports,
  mockReportContextWithError,
  mockDashboardLockedReportContext,
  mockMlrReportContext,
  mockMlrDashboardReportContext,
  mockMcparReportStore,
  mockMlrLockedReportStore,
  mockNaaarReportContext,
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

const mlrDashboardViewWithLockedReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardLockedReportContext}>
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

const dashboardViewWithLockedReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockDashboardLockedReportContext}>
      <DashboardPage reportType="MLR" />
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

const archivedReport = {
  ...report,
  archived: true,
};

const archivedReportStore = {
  ...rest,
  report: archivedReport,
  reportsByState: [archivedReport],
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

describe("<DashboardTable />", () => {
  describe("Test Report Dashboard view (with reports, desktop view)", () => {
    beforeEach(() => {
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
          screen.getAllByRole("cell", { name: "testProgram" })[0]
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
          screen.getAllByRole("cell", { name: "testSubmission" })[0]
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
      const enterReportButton = screen.getAllByTestId("enter-report")[0];
      expect(enterReportButton).toBeVisible();
      await act(async () => {
        await userEvent.click(enterReportButton);
      });
      await waitFor(async () => {
        expect(mockMcparReportContext.setReportSelection).toHaveBeenCalledTimes(
          1
        );
        expect(mockUseNavigate).toBeCalledTimes(1);
        expect(mockUseNavigate).toBeCalledWith("/mock/mock-route-1");
      });
    });

    test("Clicking 'Add a Program' button opens the AddEditReportModal", async () => {
      Object.defineProperty(window, "location", {
        configurable: true,
        enumerable: true,
        value: {
          pathname: "/mcpar",
        },
      });
      render(dashboardViewWithReports);
      const addReportButton = screen.getByText(mcparVerbiage.body.callToAction);
      expect(addReportButton).toBeVisible();
      await act(async () => {
        await userEvent.click(addReportButton);
      });
      await waitFor(async () => {
        expect(screen.getByTestId("add-edit-report-form")).toBeVisible();
      });
    });

    test("Clicking the edit icon opens the AddEditProgramModal", async () => {
      render(dashboardViewWithReports);
      const addReportButton = screen.getAllByAltText(/^Edit/)[0];
      expect(addReportButton).toBeVisible();
      await act(async () => {
        await userEvent.click(addReportButton);
      });
      await waitFor(async () => {
        expect(screen.getByTestId("add-edit-report-form")).toBeVisible();
      });
    });

    test("Unable to edit a report if it is locked", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrLockedReportStore,
      });
      render(dashboardViewWithLockedReport);
      await waitFor(() => {
        const addReportButtons = screen.queryAllByAltText(/^Edit/);
        expect(addReportButtons).toHaveLength(0);
      });
    });

    test("Shows submissionCount to admin", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...multiSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(screen.getAllByRole("cell", { name: "123" })[0]).toBeVisible();
      });
    });

    test("Shows submissionCount as 1", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...zeroSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(screen.getAllByRole("cell", { name: "1" })[0]).toBeVisible();
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
          screen.queryByRole("cell", { name: "123" })
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

  describe("Test Dashboard report archiving privileges (desktop)", () => {
    beforeEach(() => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Admin user can archive reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockMcparReportStore,
      });
      render(dashboardViewWithReports);
      await waitFor(async () => {
        const archiveProgramButton = screen.getByRole("button", {
          name: /Archive/,
        });
        expect(archiveProgramButton).toBeVisible();
        await act(async () => {
          await userEvent.click(archiveProgramButton);
        });
        expect(mockMcparReportContext.archiveReport).toHaveBeenCalledTimes(1);
        // once for render, once for archive
        expect(
          mockMcparReportContext.fetchReportsByState
        ).toHaveBeenCalledTimes(2);
      });
    });

    test("Admin user can unarchive reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...archivedReportStore,
      });
      render(dashboardViewWithReports);
      const archiveProgramButton = screen.getByRole("button", {
        name: /Unarchive/,
      });
      expect(archiveProgramButton).toBeVisible();
      await act(async () => {
        await userEvent.click(archiveProgramButton);
      });
      await waitFor(async () => {
        expect(mockMcparReportContext.archiveReport).toHaveBeenCalledTimes(1);
        // once for render, once for archive
        expect(
          mockMcparReportContext.fetchReportsByState
        ).toHaveBeenCalledTimes(2);
      });
    });

    test("State approver can archive reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateApproverStore,
        ...mockMcparReportStore,
      });
      render(dashboardViewWithReports);
      const archiveProgramButton = screen.getByRole("button", {
        name: /Archive/,
      });
      expect(archiveProgramButton).toBeVisible();
      await act(async () => {
        await userEvent.click(archiveProgramButton);
      });
      await waitFor(async () => {
        expect(mockMcparReportContext.archiveReport).toHaveBeenCalledTimes(1);
        // once for render, once for archive
        expect(
          mockMcparReportContext.fetchReportsByState
        ).toHaveBeenCalledTimes(2);
      });
    });

    test("Help desk user cannot archive reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockHelpDeskUserStore,
        ...mockMcparReportStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.queryByRole("button", {
            name: /Archive/,
          })
        ).not.toBeInTheDocument();
      });
    });

    test("Internal user cannot archive reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockInternalUserStore,
        ...mockMcparReportStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.queryByRole("button", {
            name: /Archive/,
          })
        ).not.toBeInTheDocument();
      });
    });

    test("State user cannot archive reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(
          screen.queryByRole("button", {
            name: /Archive/,
          })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Test Dashboard report releasing privileges (desktop)", () => {
    beforeEach(() => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Admin user can release reports", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockMlrLockedReportStore,
      });
      render(mlrDashboardViewWithLockedReports);
      const releaseProgramButton = screen.getAllByText("Unlock")[0];
      expect(releaseProgramButton).toBeVisible();
      expect(releaseProgramButton).toBeEnabled();
      await act(async () => {
        await userEvent.click(releaseProgramButton);
      });
      await waitFor(async () => {
        expect(mockMlrReportContext.releaseReport).toHaveBeenCalledTimes(1);
        // once for render, once for release
        expect(mockMlrReportContext.fetchReportsByState).toHaveBeenCalledTimes(
          2
        );
      });
    });

    test("State user cannot release reports", async () => {
      render(mlrDashboardViewWithReports);
      await waitFor(() => {
        expect(screen.queryByAltText("Unlock")).toBeNull();
      });
    });
  });

  describe("Test Dashboard with no activeState", () => {
    beforeEach(() => {
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
