import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsOverlay } from "./EntityDetailsOverlay";
// utils
import {
  mockAdminUserStore,
  mockEntityStore,
  mockModalOverlayForm,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";
import overlayVerbiage from "../../verbiage/pages/overlays";

const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const entityDetailsOverlayComponentStateUser = (
  <RouterWrappedComponent>
    <EntityDetailsOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      disabled={false}
      setEntering={jest.fn()}
    />
  </RouterWrappedComponent>
);

const entityDetailsOverlayComponentAdminUser = (
  <RouterWrappedComponent>
    <EntityDetailsOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      disabled={true}
      setEntering={jest.fn()}
    />
  </RouterWrappedComponent>
);

describe("Test EntityDetailsOverlayV2 (empty state)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const user = userEvent.setup();
  const selectedEntity = mockEntityStore.selectedEntity;

  it("should render the initial view for a state user", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockEntityStore,
    });
    render(entityDetailsOverlayComponentStateUser);

    // Close out of the Overlay it opened
    const closeButton = screen.getByText("Return to MLR Reporting");
    expect(closeButton).toBeVisible();

    // Check if header is visible on load - H2
    expect(
      screen.getByText(overlayVerbiage.MLR.intro.subsection)
    ).toBeVisible();

    // Check if accordion is showing
    const accordionHeader = accordionVerbiage.MLR.formIntro.buttonLabel;
    expect(screen.getByText(accordionHeader)).toBeVisible();

    // Check if MLR Report For is showing the correct Entity Data
    const reportPlanName = selectedEntity!.report_planName;
    const reportProgramName = selectedEntity!.report_programName;
    const eligibilityGroup = selectedEntity!.report_eligibilityGroup[0].value;
    const reportingPeriod = `${
      selectedEntity!.report_reportingPeriodStartDate
    } to ${selectedEntity!.report_reportingPeriodEndDate}`;

    expect(screen.getByText(reportPlanName)).toBeVisible();
    expect(screen.getByText(reportProgramName)).toBeVisible();
    expect(screen.getByText(eligibilityGroup)).toBeVisible();
    expect(screen.getByText(reportingPeriod)).toBeVisible();

    // Make sure footer button appears correctly
    const saveAndReturn = screen.getByText("Save & return");
    expect(saveAndReturn).toBeVisible();
  });

  it("should render the initial view for an admin", async () => {
    mockedUseStore.mockReturnValue({
      ...mockAdminUserStore,
      ...mockEntityStore,
    });
    render(entityDetailsOverlayComponentAdminUser);

    // Close out of the Overlay it opened
    const closeButton = screen.getByText("Return to MLR Reporting");
    expect(closeButton).toBeVisible();

    // Check if header is visible on load - H2
    expect(
      screen.getByText(overlayVerbiage.MLR.intro.subsection)
    ).toBeVisible();

    // Check if accordion is showing
    const accordionHeader = accordionVerbiage.MLR.formIntro.buttonLabel;
    expect(screen.getByText(accordionHeader)).toBeVisible();

    // Check if MLR Report For is showing the correct Entity Data
    const reportPlanName = selectedEntity!.report_planName;
    const reportProgramName = selectedEntity!.report_programName;
    const eligibilityGroup = selectedEntity!.report_eligibilityGroup[0].value;
    const reportingPeriod = `${
      selectedEntity!.report_reportingPeriodStartDate
    } to ${selectedEntity!.report_reportingPeriodEndDate}`;

    expect(screen.getByText(reportPlanName)).toBeVisible();
    expect(screen.getByText(reportProgramName)).toBeVisible();
    expect(screen.getByText(eligibilityGroup)).toBeVisible();
    expect(screen.getByText(reportingPeriod)).toBeVisible();

    // Make sure footer button appears correctly for admins
    const returnButton = screen.getByText("Return");
    expect(returnButton).toBeVisible();
  });

  it("should call the close overlay function when clicking Return to MLR", async () => {
    // Set as State User
    mockedUseStore.mockReturnValue(mockStateUserStore);
    render(entityDetailsOverlayComponentStateUser);

    // Close out of the Overlay it opened
    const closeButton = screen.getByText("Return to MLR Reporting");
    await user.click(closeButton);
    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });

  it("should call the close overlay function when clicking Return to MLR as an Admin", async () => {
    // Set as State User
    mockedUseStore.mockReturnValue(mockAdminUserStore);
    render(entityDetailsOverlayComponentAdminUser);

    // Close out of the Overlay it opened
    const closeButton = screen.getByText("Return to MLR Reporting");
    await user.click(closeButton);
    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });
});
