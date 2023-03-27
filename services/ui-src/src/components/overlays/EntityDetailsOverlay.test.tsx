import { EntityProvider } from "components/reports/EntityProvider";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { EntityDetailsOverlay } from "./EntityDetailsOverlay";
import form from "../../forms/mlr/mlr.json";
import { EntityType, FormJson } from "types";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";

const formJSON: FormJson = form.routes[1].overlayForm!;
const mockClose = jest.fn();
const mockSidebarHidden = jest.fn();

const overlayProps = {
  entityType: "program" as EntityType,
  verbiage: {},
  form: formJSON,
  selectedEntity: { id: "foo" },
  closeEntityDetailsOverlay: mockClose,
  setSidebarHidden: mockSidebarHidden,
};

const entityDetailsOverlay = (
  <RouterWrappedComponent>
    <EntityProvider>
      <EntityDetailsOverlay {...overlayProps} />
    </EntityProvider>
  </RouterWrappedComponent>
);

describe("Test EntityDetailsOverlay", () => {
  it("Should show a close button", async () => {
    const { findByText } = render(entityDetailsOverlay);
    expect(await findByText("Return to MLR Reporting")).toBeVisible();
  });

  it("Should invoke the close function when you click the close button.", async () => {
    const { findByText } = render(entityDetailsOverlay);
    const closeButton = await findByText("Return to MLR Reporting");
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalled();
  });

  it("Should set the sidebar hidden on load", () => {
    render(entityDetailsOverlay);
    expect(mockSidebarHidden).toHaveBeenCalledWith(true);
  });

  it("Should set the sidebar visible on unmount", () => {
    const { unmount } = render(entityDetailsOverlay);
    unmount();
    expect(mockSidebarHidden).toHaveBeenCalledWith(false);
  });
});

describe("Test EntityDetailsOverlay accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(entityDetailsOverlay);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
