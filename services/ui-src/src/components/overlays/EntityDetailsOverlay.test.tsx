import { EntityProvider } from "components/reports/EntityProvider";
import {
  mockAdminUser,
  mockMlrReportContext,
  mockModalOverlayForm,
  mockModalOverlayReportPageVerbiage,
  mockStateRep,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { EntityDetailsOverlay } from "./EntityDetailsOverlay";
import { EntityType } from "types";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { ReportContext } from "components/reports/ReportProvider";
import { useUser } from "utils";

const mockClose = jest.fn();
const mockSidebarHidden = jest.fn();

const overlayProps = {
  entityType: "program" as EntityType,
  verbiage: mockModalOverlayReportPageVerbiage,
  form: mockModalOverlayForm,
  selectedEntity: mockMlrReportContext.report.fieldData.program[1],
  closeEntityDetailsOverlay: mockClose,
  setSidebarHidden: mockSidebarHidden,
};

const mockUpdate = jest.fn();
const mockedReportContext = {
  ...mockMlrReportContext,
  updateReport: mockUpdate,
};

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should show a close button", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { findByText } = render(entityDetailsOverlay);
    expect(await findByText("Return to MLR Reporting")).toBeVisible();
  });

  it("Should invoke the close function when you click the close button.", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { findByText } = render(entityDetailsOverlay);
    const closeButton = await findByText("Return to MLR Reporting");
    await userEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalled();
  });

  it("Should set the sidebar hidden on load", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(entityDetailsOverlay);
    expect(mockSidebarHidden).toHaveBeenCalledWith(true);
  });

  it("Should set the sidebar visible on unmount", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { unmount } = render(entityDetailsOverlay);
    unmount();
    expect(mockSidebarHidden).toHaveBeenCalledWith(false);
  });

  it("Should submit entity info when clicking submit if state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const wrapper = render(entityDetailsOverlay);
    const textField = await screen.getByLabelText(
      "mock modal overlay text field"
    );
    await userEvent.type(textField, "test");
    const firstCheckbox = wrapper.getByRole("radio", { name: "option 1" });
    fireEvent.click(firstCheckbox);

    // Confirm the checkboxes are checked correctly
    const checkedCheckboxes = wrapper.getAllByRole("radio", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(1);
    expect(firstCheckbox).toBeChecked();

    const saveAndCloseButton = screen.getByText("Save & return");
    await userEvent.click(saveAndCloseButton);

    expect(mockedReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Should submit entity info when clicking submit if State Rep", async () => {
    mockedUseUser.mockReturnValue(mockStateRep);
    const wrapper = render(entityDetailsOverlay);
    const textField = await screen.getByLabelText(
      "mock modal overlay text field"
    );
    await userEvent.type(textField, "test");
    const firstCheckbox = wrapper.getByRole("radio", { name: "option 1" });
    fireEvent.click(firstCheckbox);

    // Confirm the checkboxes are checked correctly
    const checkedCheckboxes = wrapper.getAllByRole("radio", {
      checked: true,
    });
    expect(checkedCheckboxes).toHaveLength(1);
    expect(firstCheckbox).toBeChecked();

    const saveAndCloseButton = screen.getByText("Save & return");
    await userEvent.click(saveAndCloseButton);

    expect(mockedReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Should not submit entity info when clicking submit if admin user", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    render(entityDetailsOverlay);

    const saveAndCloseButton = screen.getByText("Save & return");
    await userEvent.click(saveAndCloseButton);

    expect(mockedReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test EntityDetailsOverlay accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(entityDetailsOverlay);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
