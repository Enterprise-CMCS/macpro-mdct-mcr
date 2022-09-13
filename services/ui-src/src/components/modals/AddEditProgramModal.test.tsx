import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { AddEditProgramModal, ReportContext } from "components";
import { mockReportContext } from "utils/testing/setupJest";

const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
};

const modalComponent = (
  <ReportContext.Provider value={mockedReportContext}>
    <AddEditProgramModal
      activeState="AB"
      selectedReportId={undefined}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

const modalComponentWithSelectedReport = (
  <ReportContext.Provider value={mockedReportContext}>
    <AddEditProgramModal
      activeState="AB"
      selectedReportId="mock-report-id"
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

describe("Test AddEditProgramModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddEditProgramModal shows the contents", () => {
    expect(screen.getByText("Add a Program")).toBeTruthy();
    expect(screen.getByText("Save")).toBeTruthy();
  });

  test("AddEditProgramModals top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditProgramModals bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditProgramModal functionality", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = async (form: any) => {
    const programNameField = form.querySelector("[name='aep-programName']")!;
    await userEvent.type(programNameField, "fake program name");
    const startDateField = form.querySelector("[name='aep-startDate']")!;
    await userEvent.type(startDateField, "1/1/2022");
    const endDateField = form.querySelector("[name='aep-endDate']")!;
    await userEvent.type(endDateField, "12/31/2022");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
  };

  test("Adding a new program", async () => {
    const result = await render(modalComponent);
    const form = result.getByTestId("add-edit-program-form");
    await fillForm(form);
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Editing an existing program", async () => {
    const result = await render(modalComponentWithSelectedReport);
    const form = result.getByTestId("add-edit-program-form");
    await fillForm(form);
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditProgramModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
