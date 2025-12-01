import { render, screen } from "@testing-library/react";
// components
import { EntityDetailsOverlayQualityMeasures } from "./EntityDetailsOverlayQualityMeasures";
// utils
import {
  mockEntityStore,
  mockMcparReport,
  mockModalOverlayReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import overlayVerbiage from "verbiage/pages/overlays";

const mockCloseEntityDetailsOverlay = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const entityDetailsOverlayQualityMeasuresComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlayQualityMeasures
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      report={mockMcparReport}
      route={mockModalOverlayReportPageJson}
      selectedEntity={mockEntityStore.selectedEntity!}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlayQualityMeasures />", () => {
  test("should render the initial view for a state user", () => {
    render(entityDetailsOverlayQualityMeasuresComponent);
    // Check if header is visible on load - H2
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: overlayVerbiage.MCPAR.intro.subsection,
      })
    ).toBeVisible();

    // Check list is showing the correct entity data
    expect(
      screen.getByRole("listitem", {
        name: "Measure identification number or definition: CMIT: 1234",
      })
    ).toBeVisible();
    expect(
      screen.getByRole("listitem", { name: "Data version: mock value" })
    ).toBeVisible();
    expect(
      screen.getByRole("listitem", {
        name: "Activities the quality measure is used in: mock value",
      })
    ).toBeVisible();

    // Make sure footer button appears correctly
    const saveAndReturn = screen.getByRole("button", { name: "Save & return" });
    expect(saveAndReturn).toBeVisible();
  });
});
