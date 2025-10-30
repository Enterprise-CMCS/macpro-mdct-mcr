import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { EntityDetailsFormOverlay } from "./EntityDetailsFormOverlay";
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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockEntityStore,
});

const entityDetailsFormOverlayComponent = (
  disabled: boolean = false,
  submitting: boolean = false
) => (
  <RouterWrappedComponent>
    <EntityDetailsFormOverlay
      closeEntityDetailsOverlay={mockCloseEntityDetailsOverlay}
      disabled={disabled}
      form={details!.childForms![0].form}
      onSubmit={mockOnSubmit}
      selectedEntity={mockEntityStore.selectedEntity}
      submitting={submitting}
      validateOnRender={false}
      verbiage={details!.childForms![0].verbiage!}
    />
  </RouterWrappedComponent>
);

describe("<EntityDetailsFormOverlay />", () => {
  test("renders form", async () => {
    render(entityDetailsFormOverlayComponent());

    // Verbiage
    const h2 = screen.getByRole("heading", {
      level: 2,
      name: "Mock Child Form",
    });
    expect(h2).toBeVisible();

    // Form
    const radioButtonYes = screen.getByRole("radio", { name: "Mock Yes" });
    await act(async () => {
      await userEvent.click(radioButtonYes);
    });

    // Submit
    const submitButton = screen.getByRole("button", { name: "Save & return" });
    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(mockOnSubmit).toBeCalled();
  });

  test("closes overlay", async () => {
    render(entityDetailsFormOverlayComponent());
    const closeButton = screen.getByRole("button", {
      name: "Mock Back Button: Child",
    });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
  });

  test("disables submit button", async () => {
    render(entityDetailsFormOverlayComponent(true, false));
    const closeButton = screen.getByRole("button", { name: "Return" });
    const submitButton = screen.queryByRole("button", {
      name: "Save & return",
    });
    await act(async () => {
      await userEvent.click(closeButton);
    });

    expect(mockCloseEntityDetailsOverlay).toBeCalled();
    expect(submitButton).toBeNull();
  });

  test("shows spinner when submitting", () => {
    render(entityDetailsFormOverlayComponent(false, true));
    const loading = screen.getByRole("button", { name: "Loading..." });
    expect(loading).toBeVisible();
  });
});
