import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { Dashboard } from "routes";
import { ReportContext } from "components";
// utils
import {
  mockAdminUser,
  mockNoUser,
  mockReportStatus,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useUser } from "utils";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const mockUseNavigate = jest.fn();

const mockUseBreakpoint = jest.fn(() => ({
  isDesktop: true,
  isTablet: false,
  isMobile: false,
}));

const mockMakeMediaQueryClasses = jest.fn(() => "desktop");

jest.mock("utils/other/useBreakpoint", () => ({
  useBreakpoint: jest.fn(() => ({
    isDesktop: true,
    isTablet: false,
    isMobile: false,
  })),
  makeMediaQueryClasses: jest.fn(() => "desktop"),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const mockReportMethods = {
  setReport: jest.fn(() => {}),
  setReportData: jest.fn(() => {}),
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
  removeReport: jest.fn(() => {}),
  fetchReportsByState: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  report: {},
  reportData: {},
  reportsByState: [mockReportStatus],
  errorMessage: undefined,
};

const mockReportContextNoReports = {
  ...mockReportContext,
  reportsByState: undefined!,
};

const mockReportContextWithError = {
  ...mockReportContext,
  errorMessage: "test error",
};

const dashboardViewWithReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <Dashboard />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dashboardViewNoReports = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextNoReports}>
      <Dashboard />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const dashboardViewWithError = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithError}>
      <Dashboard />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test /mcpar/dashboard view with reports (desktop view)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    await act(async () => {
      await render(dashboardViewWithReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Check that /mcpar/dashboard view renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
    expect(screen.queryByText(verbiage.body.empty)).not.toBeInTheDocument();
  });

  test("Clicking 'Enter' button on a report navigates to /mcpar/program-information/point-of-contact", async () => {
    const enterReportButton = screen.getByText("Enter");
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith(
      "../../mcpar/program-information/point-of-contact"
    );
  });

  test("Clicking 'Add a Program' button opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByText(verbiage.body.callToAction);
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });

  test.only("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByAltText("Edit Program");
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });
});

describe("Test /mcpar/dashboard view with reports (tablet view)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isDesktop: false,
      isTablet: true,
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("tablet");
    await act(async () => {
      await render(dashboardViewWithReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Check that /mcpar/dashboard view renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
    expect(screen.queryByText(verbiage.body.empty)).not.toBeInTheDocument();
  });

  test("Clicking 'Enter' button on a report navigates to /mcpar/program-information/point-of-contact", async () => {
    const enterReportButton = screen.getByText("Enter");
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith(
      "../../mcpar/program-information/point-of-contact"
    );
  });

  test("Clicking 'Add a Program' button opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByText(verbiage.body.callToAction);
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });

  test.only("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByAltText("Edit Program");
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });
});

describe("Test /mcpar/dashboard view with reports (mobile view)", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockUseBreakpoint.mockReturnValue({
      isDesktop: false,
      isTablet: false,
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

  test("Check that /mcpar/dashboard view renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
    expect(screen.queryByText(verbiage.body.empty)).not.toBeInTheDocument();
  });

  test("Clicking 'Enter' button on a report navigates to /mcpar/program-information/point-of-contact", async () => {
    const enterReportButton = screen.getByText("Enter");
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith(
      "../../mcpar/program-information/point-of-contact"
    );
  });

  test("Clicking 'Add a Program' button opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByText(verbiage.body.callToAction);
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });

  test.only("Clicking 'Edit Program' icon opens the AddEditProgramModal", async () => {
    const addProgramButton = screen.getByAltText("Edit Program");
    expect(addProgramButton).toBeVisible();
    await userEvent.click(addProgramButton);
    await expect(screen.getByTestId("add-edit-program-form")).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with admin user", () => {
  test("Admin user can delete reports", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    const deleteProgramButton = screen.getByAltText("Delete Program");
    expect(deleteProgramButton).toBeVisible();
    await userEvent.click(deleteProgramButton);
  });
});

describe("Test /mcpar/dashboard with no activeState", () => {
  test("dashboard reroutes to / with no active state", async () => {
    mockedUseUser.mockReturnValue(mockNoUser);
    await act(async () => {
      await render(dashboardViewWithReports);
    });
    expect(mockUseNavigate).toBeCalledWith("/");
  });
});

describe("Test /mcpar/dashboard with no reports (desktop)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isDesktop: true,
      isTablet: false,
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dashboard renders table with empty text", async () => {
    expect(screen.getByText(verbiage.body.empty)).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with no reports (tablet)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isDesktop: false,
      isTablet: true,
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("tablet");
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dashboard renders table with empty text", async () => {
    expect(screen.getByText(verbiage.body.empty)).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with no reports (mobile)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isDesktop: false,
      isTablet: false,
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dashboard renders table with empty text", async () => {
    expect(screen.getByText(verbiage.body.empty)).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with error", () => {
  test("Error alert shows when there is an error", async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dashboardViewWithError);
    });
    expect(screen.getByText("test error")).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with no reports (tablet)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isDesktop: false,
      isTablet: true,
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("tablet");
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dashboard renders table with empty text", async () => {
    expect(screen.getByText(verbiage.body.empty)).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with error", () => {
  test("Error alert shows when there is an error", async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dashboardViewWithError);
    });
    expect(screen.getByText("test error")).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with no reports (mobile)", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isDesktop: false,
      isTablet: false,
      isMobile: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    await act(async () => {
      await render(dashboardViewNoReports);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("dashboard renders table with empty text", async () => {
    expect(screen.getByText(verbiage.body.empty)).toBeVisible();
  });
});

describe("Test /mcpar/dashboard with error", () => {
  test("Error alert shows when there is an error", async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dashboardViewWithError);
    });
    expect(screen.getByText("test error")).toBeVisible();
  });
});

describe("Test /mcpar dashboard view accessibility", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should not have basic accessibility issues (desktop)", async () => {
    mockUseBreakpoint.mockReturnValue({
      isDesktop: true,
      isTablet: false,
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
