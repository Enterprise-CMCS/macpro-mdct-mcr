import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, DrawerReportPage } from "components";
// utils
import { useStore } from "utils";
import {
  mockAdminUserStore,
  mockDrawerReportPageJson,
  mockNoUserStore,
  mockMcparReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
  mockEntityStore,
  mockVerbiageIntro,
  mockDrawerForm,
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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockStateUserStore);

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const mockReportContextWithoutEntities = {
  ...mockMcparReportContext,
  report: undefined,
};

const drawerReportPageWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
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
    <ReportContext.Provider value={mockMcparReportContext}>
      <DrawerReportPage route={mockDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test DrawerReportPage without entities", () => {
  beforeEach(() => {
    render(drawerReportPageWithoutEntities);
  });

  it("should render the view", () => {
    expect(
      screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
    ).toBeVisible();
  });

  it("should not have any way to open the side drawer", () => {
    const drawerButtons = screen.queryAllByText("Enter");
    expect(drawerButtons).toEqual([]);
  });
});

describe("Test DrawerReportPage with entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
      ...mockEntityStore,
    });
    render(drawerReportPageWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the view", () => {
    expect(
      screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
    ).toBeVisible();
  });

  it("Opens the sidedrawer correctly", async () => {
    const visibleEntityText =
      mockMcparReportContext.report.fieldData.plans[1].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("Selected 'Not reporting data' should disable the 'Enter' button for Prior Authorization", async () => {
    const mockPriorAuthReportPageJson = {
      name: "mock-route",
      path: "/mcpar/plan-level-indicators/prior-authorization",
      pageType: "drawer",
      entityType: "plans",
      verbiage: {
        intro: mockVerbiageIntro,
        dashboardTitle: "Mock dashboard title",
        drawerTitle: "Mock drawer title",
      },
      form: {
        id: "pa",
        fields: [
          {
            id: "plan_priorAuthorizationReporting",
            type: "radio",
            validation: "radio",
            props: {
              label: "Are you reporting data prior to June 2026?",
              hint: "If “Yes”, please complete the following questions under each plan.",
              choices: [
                {
                  id: "IELJsTZxQkFDkTMzWQkKocwb",
                  label: "Not reporting data",
                },
                {
                  id: "bByTWRIwTSTBncyZRUiibagB",
                  label: "Yes",
                },
              ],
            },
          },
        ],
      },
      drawerForm: mockDrawerForm,
    };

    const priorAuthReportingDrawerReportPage = (
      <RouterWrappedComponent>
        <ReportContext.Provider value={mockMcparReportContext}>
          <DrawerReportPage route={mockPriorAuthReportPageJson} />
        </ReportContext.Provider>
      </RouterWrappedComponent>
    );

    render(priorAuthReportingDrawerReportPage);
    const notReportingDataButton = screen.getAllByRole("radio")[0];
    await userEvent.click(notReportingDataButton);
    const launchDrawerButton = screen.getAllByText("Enter")[1];
    expect(launchDrawerButton).toBeDisabled;
  });

  it("Submit sidedrawer opens and saves for state user", async () => {
    const visibleEntityText =
      mockMcparReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock drawer text field");
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Submit sidedrawer opens but admin user doesnt see save and close button", async () => {
    mockedUseStore.mockReturnValue({
      ...mockAdminUserStore,
      ...mockMcparReportStore,
    });
    const visibleEntityText =
      mockMcparReportContext.report.fieldData.plans[0].name;
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
    mockedUseStore.mockReturnValue({
      ...mockNoUserStore,
      ...mockMcparReportStore,
    });
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
  });

  it("Submit sidedrawer doesn't save if no change was made by State User", async () => {
    const visibleEntityText =
      mockMcparReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    const launchDrawerButton = screen.getAllByText("Enter")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const textField = await screen.getByLabelText("mock drawer text field");
    expect(textField).toBeVisible();
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test DrawerReportPage with completed entity", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    render(drawerReportPageWithCompletedEntity);
  });

  it("should render the view", () => {
    expect(
      screen.getByText(mockDrawerReportPageJson.verbiage.dashboardTitle)
    ).toBeVisible();
  });

  it("should show the completed state on one entity", () => {
    const visibleEntityText =
      mockMcparReportContext.report.fieldData.plans[0].name;
    expect(screen.getByText(visibleEntityText)).toBeVisible();
    expect(screen.queryAllByText("Edit")).toHaveLength(1);
    expect(screen.queryAllByText("Enter")).toHaveLength(1);
    expect(screen.getAllByAltText("Entity is complete")).toHaveLength(1);
  });
});

describe("Test DrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    const { container } = render(drawerReportPageWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
