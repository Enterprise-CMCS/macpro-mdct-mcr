import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DrawerReportPage } from "components";
// utils
import { useUser } from "utils";
import {
  mockAdminUser,
  mockDrawerReportPageJson,
  mockNoUser,
  mockReportContext,
  mockStateRep,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// constants
import { saveAndCloseText } from "../../constants";

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

const mockReportWithCompletedEntityContext = {
  ...mockReportContext,
  report: {
    ...mockReportContext.report,
    fieldData: {
      ...mockReportContext.report.fieldData,
      plans: [
        {
          id: 123,
          name: "example-plan1",
          "mock-drawer-text-field": "example-explanation",
        },
        { id: 456, name: "example-plan2" },
      ],
    },
  },
};

const drawerReportPageWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <DrawerReportPage route={mockDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const drawerReportPageWithoutEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <DrawerReportPage route={mockDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const drawerReportPageWithCompletedEntity = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportWithCompletedEntityContext}>
      <DrawerReportPage route={mockDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DrawerReportPage without entities", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerReportPageWithoutEntities);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("drawer-report-page")).toBeVisible();
  });

  it("should not have any way to open the side drawer", () => {
    const drawerButtons = screen.queryAllByText("Enter");
    expect(drawerButtons).toEqual([]);
  });
});

describe("Test DrawerReportPage with entities", () => {
  beforeEach(() => {
    render(drawerReportPageWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the view", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    expect(screen.getByTestId("drawer-report-page")).toBeVisible();
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
    const textField = await screen.getByLabelText("mock drawer text field");
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Submit sidedrawer opens and saves for state rep user", async () => {
    mockedUseUser.mockReturnValue(mockStateRep);
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock drawer text field");
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
    const textField = await screen.getByLabelText("mock drawer text field");
    expect(textField).toBeVisible();
    const saveAndCloseButton = screen.queryByText(saveAndCloseText);
    expect(saveAndCloseButton).toBeFalsy();
  });

  it("Submit sidedrawer bad user can't submit the form", async () => {
    mockedUseUser.mockReturnValue(mockNoUser);
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test DrawerReportPage with completed entity", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(drawerReportPageWithCompletedEntity);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("drawer-report-page")).toBeVisible();
  });

  it("should show the completed state on one entity", () => {
    const visibleEntityText = mockReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    expect(screen.queryAllByText("Edit")).toHaveLength(1);
    expect(screen.queryAllByText("Enter")).toHaveLength(1);
    expect(screen.getAllByAltText("Entity is complete")).toHaveLength(1);
  });
});

describe("Test DrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(drawerReportPageWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
