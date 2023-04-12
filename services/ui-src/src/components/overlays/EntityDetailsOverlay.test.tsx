import { EntityProvider } from "components/reports/EntityProvider";
import {
  mockMlrReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { EntityDetailsOverlay } from "./EntityDetailsOverlay";
import form from "../../forms/mlr/mlr.json";
import { EntityType, FormJson } from "types";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { ReportContext } from "components/reports/ReportProvider";

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

const mockUpdate = jest.fn();
const mockedReportContext = {
  ...mockMlrReportContext,
  updateReport: mockUpdate,
};

const entityDetailsOverlay = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <EntityProvider>
        <EntityDetailsOverlay {...overlayProps} />
      </EntityProvider>
    </ReportContext.Provider>
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

  it("Should submit entity info when clicking submit", async () => {
    const { findByText } = render(entityDetailsOverlay);
    const submitButton = await findByText("Submit");
    await userEvent.click(submitButton);
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSidebarHidden).toHaveBeenCalledWith(false);
    expect(mockClose).toHaveBeenCalled();
  });

  it("Should close the sidebar when clicking cancel", async () => {
    const { findByText } = render(entityDetailsOverlay);
    const submitButton = await findByText("Cancel");
    await userEvent.click(submitButton);
    expect(mockSidebarHidden).toHaveBeenCalledWith(false);
    expect(mockClose).toHaveBeenCalled();
  });
});

describe("Test EntityDetailsOverlay accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(entityDetailsOverlay);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
