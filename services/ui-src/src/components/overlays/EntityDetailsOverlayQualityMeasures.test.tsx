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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const entityDetailsOverlayQualityMeasuresComponent = (
  <RouterWrappedComponent>
    <EntityDetailsOverlayQualityMeasures
      report={mockMcparReport}
      route={mockModalOverlayReportPageJson}
      selectedEntity={mockEntityStore.selectedEntity!}
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
