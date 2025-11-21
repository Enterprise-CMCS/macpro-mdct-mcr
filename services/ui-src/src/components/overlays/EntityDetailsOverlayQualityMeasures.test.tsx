import { render, screen } from "@testing-library/react";
// components
import { EntityDetailsOverlayQualityMeasures } from "./EntityDetailsOverlayQualityMeasures";
// types
import { EntityShape } from "types";
// utils
import {
  mockEntityStore,
  mockMcparReport,
  mockModalOverlayForm,
  mockModalOverlayReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";

const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const entityDetailsOverlayQualityMeasuresComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlayQualityMeasures
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={false}
      entities={mockEntityStore.entities as EntityShape[]}
      entityType={mockEntityStore.entityType!}
      form={mockModalOverlayForm}
      onSubmit={mockOnSubmit}
      report={mockMcparReport}
      route={mockModalOverlayReportPageJson}
      selectedEntity={mockEntityStore.selectedEntity!}
      setEntering={jest.fn()}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsOverlayQualityMeasures />", () => {
  test("should render the initial view for a state user", () => {
    render(entityDetailsOverlayQualityMeasuresComponent);
    expect(
      screen.getByText("Measure identification number or definition:")
    ).toBeVisible();
  });
});
