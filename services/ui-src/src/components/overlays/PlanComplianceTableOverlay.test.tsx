import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { OverlayProvider, PlanComplianceTableOverlay } from "components";
// types
import {
  EntityDetailsTableContentShape,
  EntityDetailsTableVerbiage,
  EntityShape,
  FormJson,
} from "types";
// utils
import {
  mockEntityDetailsMultiformOverlayJson,
  mockEntityStore,
  mockNaaarReport,
  mockNaaarStandards,
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

const { details } = mockEntityDetailsMultiformOverlayJson;
const mockForm = details?.childForms![1].form as FormJson;
const mockTable = details?.childForms![1]
  .table as EntityDetailsTableContentShape;
const mockVerbiage = details?.forms![1].verbiage as EntityDetailsTableVerbiage;
const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();

const planComplianceTableOverlayComponent = (
  disabled: boolean = false,
  submitting: boolean = false,
  selectedEntity: any = mockEntityStore.selectedEntity
) => (
  <RouterWrappedComponent>
    <OverlayProvider>
      <PlanComplianceTableOverlay
        closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
        disabled={disabled}
        standards={mockNaaarStandards}
        form={mockForm}
        onSubmit={mockOnSubmit}
        selectedEntity={selectedEntity}
        submitting={submitting}
        table={mockTable}
        validateOnRender={false}
        verbiage={mockVerbiage}
        report={mockNaaarReport}
      />
    </OverlayProvider>
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
        name: "ID Mock N/E Mock Standard Type Header Actions",
      })
    ).toBeVisible();
  });

  test("renders form", async () => {
    render(planComplianceTableOverlayComponent());

    // Table
    const enterButton = screen.getByRole("button", {
      name: "Enter",
    });
    await act(async () => {
      await userEvent.click(enterButton);
    });

    // Form
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Form 2",
    });

    expect(h2).toBeVisible();

    const closeButton = screen.getByRole("button", {
      name: "Mock Back Button: Form 2",
    });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    // Back to Table
    const tableH2 = await screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Child Table",
    });

    expect(tableH2).toBeVisible();
  });

  test("submits form", async () => {
    const mockSelectedEntity = {
      ...mockEntityStore.selectedEntity,
      "planCompliance43868_standard-mockStandard-exceptionsDescription":
        "Mock Description",
      "planCompliance43868_standard-standardTypeId-nonComplianceDescription":
        "Mock Description",
    } as EntityShape;

    render(
      planComplianceTableOverlayComponent(
        undefined,
        undefined,
        mockSelectedEntity
      )
    );

    // Table
    const exceptionsStatusCell = screen.getByRole("cell", {
      name: "Exceptions granted",
    });
    expect(exceptionsStatusCell).toBeVisible();
    expect(exceptionsStatusCell.textContent).toBe("E");

    const editButton = screen.getByRole("button", {
      name: "Edit",
    });
    await act(async () => {
      await userEvent.click(editButton);
    });

    // Form
    const radioButtonYes = screen.getByRole("radio", {
      name: "Mock Yes",
    });
    await act(async () => {
      await userEvent.click(radioButtonYes);
    });

    const nonComplianceTextbox = screen.getByRole("textbox", {
      name: "Mock Non-Compliance Description",
    });
    await act(async () => {
      await userEvent.type(nonComplianceTextbox, "Test value");
    });

    // Submit
    const submitButton = screen.getByRole("button", {
      name: "Save & return",
    });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(mockOnSubmit).toBeCalled();
  });

  test("has non-compliance", async () => {
    const mockSelectedEntity = {
      ...mockEntityStore.selectedEntity,
      "planCompliance43868_standard-standardTypeId-exceptionsDescription":
        "Mock Description",
      "planCompliance43868_standard-mockStandard-nonComplianceDescription":
        "Mock Description",
    } as EntityShape;

    render(
      planComplianceTableOverlayComponent(
        undefined,
        undefined,
        mockSelectedEntity
      )
    );

    // Table
    const exceptionsStatusCell = screen.getByRole("cell", {
      name: "Non-compliant",
    });
    expect(exceptionsStatusCell).toBeVisible();
    expect(exceptionsStatusCell.textContent).toBe("N");
    expect(
      screen.getByRole("button", {
        name: "Edit",
      })
    ).toBeVisible();
  });

  test("closes overlay", async () => {
    render(planComplianceTableOverlayComponent());
    const closeButton = screen.getByRole("button", {
      name: "Mock Back Button: Table",
    });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });
});
