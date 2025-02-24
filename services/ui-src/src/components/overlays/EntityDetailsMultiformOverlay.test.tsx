import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsMultiformOverlay } from "./EntityDetailsMultiformOverlay";
// utils
import {
  mockEntityStore,
  mockOverlayReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";

const { details } = mockOverlayReportPageJson;
const mockCloseEntityDetailsOverlay = jest.fn();
const mockOnSubmit = jest.fn();
const mockSelectedEntity = jest.fn();
const mockSetEntering = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const entityDetailsMultiformOverlayComponent = (
  disabled: boolean = false,
  submitting = false
) => (
  <RouterWrappedComponent>
    <EntityDetailsMultiformOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={disabled}
      entityType={"plans"}
      forms={details!.forms}
      onSubmit={mockOnSubmit}
      selectedEntity={mockEntityStore.selectedEntity}
      setEntering={mockSetEntering}
      setSelectedEntity={mockSelectedEntity}
      submitting={submitting}
      validateOnRender={false}
      verbiage={details!.verbiage}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsMultiformOverlay />", () => {
  test("renders form", async () => {
    render(entityDetailsMultiformOverlayComponent());

    // Verbiage
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Details: Example Plan",
    });
    const h3 = screen.getByRole("heading", { level: 3, name: "Mock heading" });
    const accordion = screen.getByText("Mock Accordion");
    expect(h2).toBeVisible();
    expect(h3).toBeVisible();
    expect(accordion).toBeVisible();

    // Form
    const radioButton = screen.getByRole("radio", { name: "Mock Yes" });
    await userEvent.click(radioButton);

    // Table
    const entityTable = screen.getByRole("table");
    const entityHeaders = screen.getByRole("row", {
      name: "Status Mock table header Action",
    });
    const entityCells = screen.getByRole("row", {
      name: "warning icon Mock Cell Enter",
    });

    expect(entityTable).toBeVisible();
    expect(entityHeaders).toBeVisible();
    expect(entityCells).toBeVisible();

    // Submit
    const submitButton = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toBeCalled();
  });

  test("closes overlay", async () => {
    render(entityDetailsMultiformOverlayComponent());
    const closeButton = screen.getByRole("button", {
      name: "Return to dashboard",
    });
    await userEvent.click(closeButton);

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });

  test("disables submit button", async () => {
    render(entityDetailsMultiformOverlayComponent(true, false));
    const closeButton = screen.getByRole("button", { name: "Return" });
    const submitButton = screen.queryByRole("button", {
      name: "Save & return",
    });
    await userEvent.click(closeButton);

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
    expect(submitButton).toBeNull();
  });

  test("shows spinner when submitting", () => {
    render(entityDetailsMultiformOverlayComponent(false, true));
    const loading = screen.getByRole("button", { name: "Loading..." });
    expect(loading).toBeVisible();
  });
});
