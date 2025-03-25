import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { PlanComplianceTableOverlay } from "./PlanComplianceTableOverlay";
// utils
import {
  mockEntityStore,
  mockEntityDetailsMultiformOverlayJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import {
  EntityDetailsTableContentShape,
  EntityDetailsTableVerbiage,
  EntityShape,
  FormJson,
} from "types";

const { details } = mockEntityDetailsMultiformOverlayJson;
const entities: EntityShape[] = [
  {
    id: "mockStandard",
    "standard_standardDescription-mockId": "Mock Description",
    "standard_analysisMethodsUtilized-mockId": [
      { key: "mockAnalysis1", value: "Mock Method 1" },
      { key: "mockAnalysis2", value: "Mock Method 2" },
    ],
    standard_coreProviderTypeCoveredByStandard: [
      { key: "mockProviderType-mockId", value: "Mock Provider" },
    ],
    "standard_coreProviderTypeCoveredByStandard-mockId-otherText":
      "Mock Other Provider",
    standard_standardType: [
      { key: "mockStandardType", value: "Mock Standard Type" },
    ],
    standard_populationCoveredByStandard: [
      { key: "mockPopulation", value: "Mock Population" },
    ],
    standard_applicableRegion: [{ key: "mockRegion", value: "Other, specify" }],
    "standard_applicableRegion-otherText": "Mock Other Region",
  },
];
const form = details?.childForms![1].form as FormJson;
const table = details?.childForms![1].table as EntityDetailsTableContentShape;
const verbiage = details?.forms![1].verbiage as EntityDetailsTableVerbiage;

const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const planComplianceTableOverlayComponent = (
  disabled: boolean = false,
  submitting: boolean = false
) => (
  <RouterWrappedComponent>
    <PlanComplianceTableOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={disabled}
      entities={entities}
      form={form}
      onSubmit={mockOnSubmit}
      selectedEntity={mockEntityStore.selectedEntity}
      submitting={submitting}
      table={table}
      validateOnRender={false}
      verbiage={verbiage}
    />
  </RouterWrappedComponent>
);

describe("<PlanComplianceTableOverlay />", () => {
  test("renders overlay", () => {
    render(planComplianceTableOverlayComponent());

    // Verbiage
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Child Table",
    });

    expect(h2).toBeVisible();
  });

  test("renders table", async () => {
    render(planComplianceTableOverlayComponent());

    // Table
    const childTable = screen.getByRole("table", {
      name: "Mock Child Table",
    });
    expect(childTable).toBeVisible();
    expect(
      within(childTable).getByRole("row", {
        name: "ID Actions",
      })
    ).toBeVisible();
  });

  test("renders form", async () => {
    render(planComplianceTableOverlayComponent());

    // Table
    const enterButton = screen.getByRole("button", {
      name: "Enter",
    });
    await userEvent.click(enterButton);

    // Form
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Form 2",
    });

    expect(h2).toBeVisible();

    const closeButton = screen.getByRole("button", {
      name: "Mock Back Button Form 2",
    });
    await userEvent.click(closeButton);

    // Back to Table
    const tableH2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Child Table",
    });

    expect(tableH2).toBeVisible();
  });

  test("submits form", async () => {
    render(planComplianceTableOverlayComponent());

    // Table
    const enterButton = screen.getByRole("button", {
      name: "Enter",
    });
    await userEvent.click(enterButton);

    // Form
    const radioButtonYes = screen.getByRole("radio", {
      name: "Mock Yes",
    });
    await userEvent.click(radioButtonYes);

    // Submit
    const submitButton = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toBeCalled();
  });

  test("closes overlay", async () => {
    render(planComplianceTableOverlayComponent());
    const closeButton = screen.getByRole("button", {
      name: "Mock Back Button Table",
    });
    await userEvent.click(closeButton);

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });
});
