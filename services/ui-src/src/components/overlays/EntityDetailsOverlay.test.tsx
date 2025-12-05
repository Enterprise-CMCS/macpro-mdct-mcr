import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsOverlay } from "./EntityDetailsOverlay";
// types
import { EntityShape, ReportShape } from "types";
// utils
import {
  mockEntityStore,
  mockMcparReport,
  mockMlrReport,
  mockModalOverlayForm,
  mockModalOverlayReportPageJson,
  mockNaaarReport,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
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
  report: ReportShape,
  route: any = mockModalOverlayReportPageJson
) => (
  <RouterWrappedComponent>
    <EntityDetailsOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      entityType={mockEntityStore.entityType!}
      entities={mockEntityStore.entities as EntityShape[]}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      disabled={false}
      report={report}
      route={route}
      setEntering={jest.fn()}
      selectedEntity={mockEntityStore.selectedEntity!}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlay />", () => {
  describe("MCPAR", () => {
    const route = {
      path: "/mcpar/plan-level-indicators/quality-measures/measures-and-results",
    };

    beforeEach(() => {
      jest.clearAllMocks();
      render(entityDetailsOverlayComponent(mockMcparReport, route));
    });

    test("should render the initial view for a state user", () => {
      expect(
        screen.getByText("Measure identification number or definition:")
      ).toBeVisible();
    });

    test("should call the close overlay function when clicking Return", async () => {
      const closeButton = screen.getByRole("button", {
        name: "Return to quality & performance measures dashboard",
      });
      await act(async () => {
        await userEvent.click(closeButton);
      });
      expect(mockCloseEntityDetailsOverlay).toHaveBeenCalled();
    });
  });

  describe("MLR", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      render(
        entityDetailsOverlayComponent(
          mockMlrReport,
          mockModalOverlayReportPageJson
        )
      );
    });

    test("should render the initial view for a state user", () => {
      expect(
        screen.getByRole("heading", {
          level: 2,
          name: overlayVerbiage.MLR.intro.subsection,
        })
      ).toBeVisible();
    });

    test("should call the close overlay function when clicking Return", async () => {
      const closeButton = screen.getByRole("button", {
        name: "Return to MLR Reporting",
      });
      await act(async () => {
        await userEvent.click(closeButton);
      });
      expect(mockCloseEntityDetailsOverlay).toHaveBeenCalled();
    });
  });

  describe("NAAAR", () => {
    test("should call the close overlay function when clicking Return", async () => {
      render(
        entityDetailsOverlayComponent(
          mockNaaarReport,
          mockModalOverlayReportPageJson
        )
      );
      const closeButton = screen.getByRole("button", { name: "Return" });
      await act(async () => {
        await userEvent.click(closeButton);
      });
      expect(mockCloseEntityDetailsOverlay).toHaveBeenCalled();
    });
  });
});
