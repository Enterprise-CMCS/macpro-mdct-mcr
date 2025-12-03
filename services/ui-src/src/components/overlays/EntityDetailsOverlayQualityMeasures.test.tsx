import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsOverlayQualityMeasures } from "./EntityDetailsOverlayQualityMeasures";
import { ReportContext } from "components";
// types
import { DrawerReportPageShape, ModalOverlayReportPageShape } from "types";
// utils
import {
  mockDrawerForm,
  mockEntityStore,
  mockMcparReport,
  mockMcparReportContext,
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
  route: DrawerReportPageShape | ModalOverlayReportPageShape
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <EntityDetailsOverlayQualityMeasures
        closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
        report={mockMcparReport}
        route={route}
        selectedMeasure={mockEntityStore.selectedEntity!}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlayQualityMeasures />", () => {
  test("should render the initial view for a state user", () => {
    render(
      entityDetailsOverlayQualityMeasuresComponent(
        mockModalOverlayReportPageJson
      )
    );
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

  test("should have drawer form and be able to submit", async () => {
    const mockDrawerFormRoute = {
      ...mockModalOverlayReportPageJson,
      drawerForm: mockDrawerForm,
    };
    render(entityDetailsOverlayQualityMeasuresComponent(mockDrawerFormRoute));

    // drawer form doesn't show on render
    expect(screen.queryByRole("form")).toBeNull();

    // open drawer
    const openDrawerButton = screen.getByRole("button", {
      name: "Enter mock-plan-name-2",
    });
    expect(openDrawerButton).toBeVisible();
    await act(async () => {
      await userEvent.click(openDrawerButton);
    });

    // fill out drawer form
    expect(screen.getByRole("form")).toBeVisible();
    const drawerField = screen.getByRole("textbox");
    expect(drawerField).toBeVisible();
    await act(async () => {
      await userEvent.type(drawerField, "test");
    });

    // close drawer
    const closeDrawerButton = screen.getByRole("button", {
      name: "Save & close",
    });
    expect(closeDrawerButton).toBeVisible();
    await act(async () => {
      await userEvent.click(closeDrawerButton);
    });
    await waitFor(() => {
      expect(screen.queryByRole("form")).toBeNull();
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    });
  });
});
