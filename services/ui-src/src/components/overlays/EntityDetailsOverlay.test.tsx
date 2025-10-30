import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsOverlay } from "./EntityDetailsOverlay";
// utils
import {
  mockEntityStore,
  mockModalOverlayForm,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";
import overlayVerbiage from "verbiage/pages/overlays";

const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const entityDetailsOverlayComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      entityType={mockEntityStore.entityType!}
      entities={mockEntityStore.entities}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      disabled={false}
      setEntering={jest.fn()}
      selectedEntity={mockEntityStore.selectedEntity!}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlay />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(entityDetailsOverlayComponent);
  });

  const user = userEvent.setup();
  const selectedEntity = mockEntityStore.selectedEntity;

  test("should render the initial view for a state user", async () => {
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

  test("should call the close overlay function when clicking Return to MLR", async () => {
    // Close out of the Overlay it opened
    const closeButton = screen.getByText("Return to MLR Reporting");
    await act(async () => {
      await user.click(closeButton);
    });
    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });
});
