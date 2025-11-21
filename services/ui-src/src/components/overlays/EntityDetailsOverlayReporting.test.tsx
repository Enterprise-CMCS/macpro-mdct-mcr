import { render, screen } from "@testing-library/react";
// components
import { EntityDetailsOverlayReporting } from "./EntityDetailsOverlayReporting";
// utils
import {
  mockEntityStore,
  mockModalOverlayForm,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { getProgramInfo, useStore } from "utils";
// types
import { EntityShape } from "types";
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

const entityDetailsOverlayReportingComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlayReporting
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={false}
      entities={mockEntityStore.entities as EntityShape[]}
      entityType={mockEntityStore.entityType!}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      selectedEntity={mockEntityStore.selectedEntity!}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlayReporting />", () => {
  test("should render the initial view for a state user", () => {
    const selectedEntity = mockEntityStore.selectedEntity!;
    render(entityDetailsOverlayReportingComponent);
    // Check if header is visible on load - H2
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: overlayVerbiage.MLR.intro.subsection,
      })
    ).toBeVisible();

    // Check if accordion is showing
    const accordionHeader = accordionVerbiage.MLR.formIntro.buttonLabel;
    expect(screen.getByRole("button", { name: accordionHeader })).toBeVisible();

    // Check if MLR Report For is showing the correct Entity Data
    const [
      reportPlanName,
      reportProgramName,
      eligibilityGroup,
      reportingPeriod,
    ] = getProgramInfo(selectedEntity);

    expect(screen.getByText(reportPlanName)).toBeVisible();
    expect(screen.getByText(reportProgramName)).toBeVisible();
    expect(screen.getByText(eligibilityGroup)).toBeVisible();
    expect(screen.getByText(reportingPeriod)).toBeVisible();

    // Make sure footer button appears correctly
    const saveAndReturn = screen.getByRole("button", { name: "Save & return" });
    expect(saveAndReturn).toBeVisible();
  });
});
