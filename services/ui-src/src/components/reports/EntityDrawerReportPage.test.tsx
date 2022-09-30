import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, EntityDrawerReportPage } from "components";
// utils
import { useUser } from "utils";
import {
  mockAdminUser,
  mockForm,
  mockEntityDrawerReportPageJson,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// constants
import { saveAndCloseText } from "../../constants";

const mockSubmittingState = {
  submitting: false,
  setSubmitting: jest.fn(),
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

const entityDrawerSectionComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <EntityDrawerReportPage
        route={{ ...mockEntityDrawerReportPageJson, form: mockForm }}
        submittingState={mockSubmittingState}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const entityDrawerSectionComponentWithoutEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <EntityDrawerReportPage
        route={{ ...mockEntityDrawerReportPageJson, form: mockForm }}
        submittingState={mockSubmittingState}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test EntityDrawerReportPage without entities", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(entityDrawerSectionComponentWithoutEntities);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("entity-drawer")).toBeVisible();
  });

  it("should not have any way to open the side drawer", () => {
    const drawerButtons = screen.queryAllByText("Enter");
    expect(drawerButtons).toEqual([]);
  });
});

describe("Test EntityDrawerReportPage with entities", () => {
  beforeEach(() => {
    render(entityDrawerSectionComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the view", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    expect(screen.getByTestId("entity-drawer")).toBeVisible();
  });

  it("Opens the sidedrawer correctly", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("Submit sidedrawer opens and saves for state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock text field");
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Submit sidedrawer opens but admin user doesnt see save and close button", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock text field");
    expect(textField).toBeVisible();
    const saveAndCloseButton = screen.queryByText(saveAndCloseText);
    expect(saveAndCloseButton).toBeFalsy();
  });
});

describe("Test EntityDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(entityDrawerSectionComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
