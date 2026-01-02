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
  mockDashboardReportContext,
  mockReportContextNoReports,
  mockReportContextWithError,
  mockDashboardLockedReportContext,
  mockMlrDashboardReportContext,
  mockMcparReportStore,
  mockMlrLockedReportStore,
} from "utils/testing/setupJest";
import {
  useBreakpoint,
  makeMediaQueryClasses,
  useStore,
  convertDateUtcToEt,
} from "utils";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-dashboard";

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
jest.mock("react-router", () => ({
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

describe("<MobileDashboardTable />", () => {
  describe("Test Dashboard view (with reports, mobile view)", () => {
    const { dueDate: utcDueDate, programName } = mockMcparReportStore.report!;
    const dueDate = convertDateUtcToEt(utcDueDate);
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
      render(dashboardViewWithReports);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("MCPAR Dashboard view renders", async () => {
      await waitFor(() => {
        expect(
          screen.getByRole("heading", {
            level: 1,
            name: `Minnesota ${mcparVerbiage.intro.header}`,
          })
        ).toBeVisible();
        expect(screen.getAllByTestId("mobile-row")[0]).toBeVisible();
        expect(
          screen.queryByText(mcparVerbiage.body.empty)
        ).not.toBeInTheDocument();
      });
    });

    test("Clicking 'Edit' button on a report navigates to first page of report", async () => {
      const enterReportButton = screen.getAllByRole("button", {
        name: `Edit ${programName} due ${dueDate} report`,
      })[0];
      expect(enterReportButton).toBeVisible();
      await act(async () => {
        await userEvent.click(enterReportButton);
      });
      await waitFor(async () => {
        expect(mockUseNavigate).toBeCalledTimes(1);
        expect(mockUseNavigate).toBeCalledWith(
          "/report/MCPAR/CO/mock-report-id"
        );
      });
    });

    test("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
      const addReportButton = screen.getAllByAltText(
        `Edit ${programName} due ${dueDate} report submission set-up information`
      )[0];
      expect(addReportButton).toBeVisible();
      await act(async () => {
        await userEvent.click(addReportButton);
      });
      await waitFor(async () => {
        expect(screen.getByTestId("add-edit-report-form")).toBeVisible();
      });
    });

    test("Shows submissionCount to admin", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...multiSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await act(async () => {});
      await waitFor(() => {
        expect(screen.getAllByText("123")[0]).toBeVisible();
      });
    });

    test("Shows submissionCount as 1", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...zeroSubmissionCountStore,
      });
      render(dashboardViewWithReports);
      await waitFor(() => {
        expect(screen.getAllByText("1")[0]).toBeVisible();
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

  describe("Test Dashboard report archiving privileges (mobile)", () => {
    beforeEach(() => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
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

  describe("Test Dashboard report releasing privileges (mobile)", () => {
    beforeEach(() => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
        isTablet: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
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
      await act(async () => {
        await userEvent.click(releaseProgramButton);
      });
      await waitFor(async () => {
        expect(mockMcparReportContext.releaseReport).toHaveBeenCalledTimes(1);
        // once for render, once for release
        expect(
          mockMcparReportContext.fetchReportsByState
        ).toHaveBeenCalledTimes(2);
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
    test("Dashboard reroutes to / with no active state", async () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
        isTablet: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
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
    it("Should not have basic accessibility issues (mobile)", async () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
      await act(async () => {
        const { container } = render(dashboardViewWithReports);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });
});
