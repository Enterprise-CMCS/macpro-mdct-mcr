import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsMultiformOverlay } from "./EntityDetailsMultiformOverlay";
// constants
import { nonCompliantLabel } from "../../constants";
// utils
import {
  mockEntityStore,
  mockOverlayReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { EntityType } from "types";

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
  submitting: boolean = false,
  chidForms: any = details!.childForms
) => (
  <RouterWrappedComponent>
    <EntityDetailsMultiformOverlay
      childForms={chidForms}
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={disabled}
      entityType={EntityType.PLANS}
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
    const radioButtonYes = screen.getByRole("radio", { name: "Mock Yes" });
    await userEvent.click(radioButtonYes);

    // Table
    const entityTable = screen.getByRole("table");
    const entityHeaders = screen.getByRole("row", {
      name: "Status Mock table header Action",
    });
    const entityCells = screen.getByRole("row", {
      name: "Mock Cell Enter",
    });
    const enterButton = screen.getByRole("button", {
      name: "Enter",
    });

    expect(entityTable).toBeVisible();
    expect(entityHeaders).toBeVisible();
    expect(entityCells).toBeVisible();
    expect(enterButton).toBeDisabled();

    // Submit
    const submitButton = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toBeCalled();
  });

  test("renders child form", async () => {
    render(entityDetailsMultiformOverlayComponent());

    // Form
    const radioButtonNo = screen.getByRole("radio", {
      name: nonCompliantLabel,
    });
    await userEvent.click(radioButtonNo);

    // Table
    const updatedEntityCellsIncomplete = screen.getByRole("row", {
      name: "warning icon Mock Cell Select “Enter” to complete response. Enter",
    });
    expect(updatedEntityCellsIncomplete).toBeVisible();

    // Click Enter
    const updatedEnterButton = screen.getByRole("button", {
      name: "Enter",
    });
    await userEvent.click(updatedEnterButton);

    // Child Form
    const childForm = screen.getByRole("heading", {
      name: "Mock Child Form",
    });
    expect(childForm).toBeVisible();
  });

  test("renders nothing if no child form", async () => {
    render(entityDetailsMultiformOverlayComponent(undefined, undefined, []));

    // Form
    const radioButtonNo = screen.getByRole("radio", {
      name: nonCompliantLabel,
    });
    await userEvent.click(radioButtonNo);

    // Table
    const entityCellsIncomplete = screen.getByRole("row", {
      name: "warning icon Mock Cell Select “Enter” to complete response. Enter",
    });
    expect(entityCellsIncomplete).toBeVisible();

    // Click Enter
    const updatedEnterButton = screen.getByRole("button", {
      name: "Enter",
    });
    await userEvent.click(updatedEnterButton);

    // Stays on Table
    const childForm = screen.queryByRole("heading", {
      name: "Mock Child Form",
    });
    expect(childForm).toBeNull();
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
