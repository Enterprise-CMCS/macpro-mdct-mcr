import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticDrawerSection } from "components";
// utils
import { useUser } from "utils";
import {
  mockAdminUser,
  mockForm,
  mockPageJsonStaticDrawer,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockLoadingState = {
  loading: false,
  setLoading: jest.fn(),
};
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockReportContextWithoutEntities = {
  ...mockReportContext,
  report: undefined,
};

const staticDrawerSectionComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticDrawerSection
        form={mockForm}
        page={mockPageJsonStaticDrawer}
        loadingState={mockLoadingState}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const staticDrawerSectionComponentWithoutEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <StaticDrawerSection
        form={mockForm}
        page={mockPageJsonStaticDrawer}
        loadingState={mockLoadingState}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticDrawerSection without entities", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(staticDrawerSectionComponentWithoutEntities);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });

  it("should not have any way to open the side drawer", () => {
    const drawerButtons = screen.queryAllByText("Enter");
    expect(drawerButtons).toEqual([]);
  });
});

describe("Test StaticDrawerSection with entities", () => {
  beforeEach(() => {
    render(staticDrawerSectionComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the view", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    expect(screen.getByTestId("static-drawer-section")).toBeVisible();
  });

  it("Opens the sidedrawer correctly", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("Submit sidedrawer works for state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock text field");
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText("Save & Close");
    await userEvent.click(saveAndCloseButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Submit sidedrawer opens but cannot submit for admin user", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock text field");
    expect(textField).toBeVisible();
    const saveAndCloseButton = screen.getByText("Save & Close");
    await userEvent.click(saveAndCloseButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test StaticDrawerSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(staticDrawerSectionComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
