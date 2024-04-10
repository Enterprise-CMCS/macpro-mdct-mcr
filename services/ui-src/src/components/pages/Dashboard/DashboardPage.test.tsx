import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
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
  mockLDFlags,
  mockMlrReportContext,
  mockMlrDashboardReportContext,
  mockMcparReportStore,
  mockMlrLockedReportStore,
} from "utils/testing/setupJest";
import { useBreakpoint, makeMediaQueryClasses, useStore } from "utils";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import mlrVerbiage from "verbiage/pages/mlr/mlr-dashboard";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

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

describe("Test Report Dashboard view (with reports, desktop view)", () => {
  beforeEach(async () => {
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
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.getByText(mcparVerbiage.intro.header)).toBeVisible();
    expect(screen.getAllByText("testProgram")[0]).toBeVisible();
    expect(
      screen.queryByText(mcparVerbiage.body.empty)
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
  });

  test("Check that MLR Dashboard view renders", async () => {
    await act(async () => {
      await render(mlrDashboardViewWithReports);
    });
    expect(screen.getByText(mlrVerbiage.intro.header)).toBeVisible();
    expect(screen.getAllByText("testProgram")[0]).toBeVisible();
    expect(screen.queryByText("Leave form")).not.toBeInTheDocument();
  });

  test("Clicking 'Edit' button on a report row fetches the field data, then navigates to report", async () => {
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    mockMcparReportContext.fetchReport.mockReturnValueOnce(mockMcparReport);
    const enterReportButton = screen.getAllByText("Edit")[0];
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockMcparReportContext.setReportSelection).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith("/mock/mock-route-1");
  });

  test("Clicking 'Add a Program' button opens the AddEditReportModal", async () => {
    mockLDFlags.set({ yoyCopy: true });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const addReportButton = screen.getByText(mcparVerbiage.body.callToAction);
    expect(addReportButton).toBeVisible();
    await userEvent.click(addReportButton);
    await expect(screen.getByTestId("add-edit-report-form")).toBeVisible();
  });

  test("Clicking 'Edit Report' icon opens the AddEditProgramModal", async () => {
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const addReportButton = screen.getAllByAltText("Edit Report")[0];
    expect(addReportButton).toBeVisible();
    await userEvent.click(addReportButton);
    await expect(screen.getByTestId("add-edit-report-form")).toBeVisible();
  });

  test("Unable to edit a report if it is locked", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMlrLockedReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithLockedReport);
    });
    const addReportButtons = screen.queryAllByAltText("Edit Report");
    expect(addReportButtons).toHaveLength(0);
  });
});

describe("Test Dashboard view (with reports, mobile view)", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    await act(async () => {
      await render(dashboardViewWithReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("MCPAR Dashboard view renders", () => {
    expect(screen.getByText(mcparVerbiage.intro.header)).toBeVisible();
    expect(screen.getAllByTestId("mobile-row")[0]).toBeVisible();
    expect(
      screen.queryByText(mcparVerbiage.body.empty)
    ).not.toBeInTheDocument();
  });

  test("Clicking 'Edit' button on a report navigates to first page of report", async () => {
    mockMcparReportContext.fetchReport.mockReturnValueOnce(mockMcparReport);
    const enterReportButton = screen.getAllByText("Edit")[0];
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith("/mock/mock-route-1");
  });

  test("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
    const addReportButton = screen.getAllByAltText("Edit Report")[0];
    expect(addReportButton).toBeVisible();
    await userEvent.click(addReportButton);
    await expect(screen.getByTestId("add-edit-report-form")).toBeVisible();
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
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const archiveProgramButton = screen.getAllByText("Archive")[0];
    expect(archiveProgramButton).toBeVisible();
    await userEvent.click(archiveProgramButton);
    await expect(mockMcparReportContext.archiveReport).toHaveBeenCalledTimes(1);
    // once for render, once for archive
    await expect(
      mockMcparReportContext.fetchReportsByState
    ).toHaveBeenCalledTimes(2);
  });

  test("Help desk user cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockHelpDeskUserStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("Internal user cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockInternalUserStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State approver cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateApproverStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State user cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
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
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const archiveProgramButton = screen.getAllByText("Archive")[0];
    expect(archiveProgramButton).toBeVisible();
    await userEvent.click(archiveProgramButton);
    await expect(mockMcparReportContext.archiveReport).toHaveBeenCalledTimes(1);
    // once for render, once for archive
    await expect(
      mockMcparReportContext.fetchReportsByState
    ).toHaveBeenCalledTimes(2);
  });

  test("Help desk user cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockHelpDeskUserStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("Internal user cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockInternalUserStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State approver cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateApproverStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
  });

  test("State user cannot archive reports", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(screen.queryByAltText("Archive")).toBeNull();
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
    await act(async () => {
      await render(mlrDashboardViewWithLockedReports);
    });
    const releaseProgramButton = screen.getAllByText("Unlock")[0];
    expect(releaseProgramButton).toBeVisible();
    expect(releaseProgramButton).toBeEnabled();
    await userEvent.click(releaseProgramButton);
    await expect(mockMlrReportContext.releaseReport).toHaveBeenCalledTimes(1);
    // once for render, once for release
    await expect(
      mockMlrReportContext.fetchReportsByState
    ).toHaveBeenCalledTimes(2);
  });

  test("State user cannot release reports", async () => {
    await act(async () => {
      await render(mlrDashboardViewWithReports);
    });
    expect(screen.queryByAltText("Unlock")).toBeNull();
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
    await act(async () => {
      await render(mlrDashboardViewWithLockedReports);
    });
    const releaseProgramButton = screen.getAllByText("Unlock")[0];
    expect(releaseProgramButton).toBeVisible();
    await userEvent.click(releaseProgramButton);
    await expect(mockMcparReportContext.releaseReport).toHaveBeenCalledTimes(1);
    // once for render, once for release
    await expect(
      mockMcparReportContext.fetchReportsByState
    ).toHaveBeenCalledTimes(2);
  });

  test("State user cannot release reports", async () => {
    await act(async () => {
      await render(mlrDashboardViewWithReports);
    });
    expect(screen.queryByAltText("Unlock")).toBeNull();
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
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(mockUseNavigate).toBeCalledWith("/");
  });
});

describe("Test MCPAR Dashboard (without reports)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseStore.mockReturnValue(mockStateUserStore);
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("MCPAR dashboard renders table with empty text", () => {
    expect(screen.getByText(mcparVerbiage.body.empty)).toBeVisible();
  });
});

describe("Test Dashboard with error", () => {
  test("Error alert shows when there is an error", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    await act(async () => {
      await render(dashboardViewWithError);
    });
    expect(screen.getByText("test error")).toBeVisible();
  });
});

describe("Test Dashboard view accessibility", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
