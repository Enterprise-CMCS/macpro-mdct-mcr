import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { AddEditReportModal, ReportContext } from "components";
import {
  mockMcparReport,
  mockMcparReportContext,
  RouterWrappedComponent,
  mockLDFlags,
} from "utils/testing/setupJest";

const mockCreateReport = jest.fn();
const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockMcparReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditReportModal
        activeState="AB"
        selectedReport={undefined}
        reportType={"MCPAR"}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalComponentWithSelectedReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditReportModal
        activeState="AB"
        selectedReport={mockMcparReport}
        reportType={"MCPAR"}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mlrModalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditReportModal
        activeState="AB"
        selectedReport={undefined}
        reportType={"MLR"}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mlrModalComponentWithSelectedReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditReportModal
        activeState="AB"
        selectedReport={mockMcparReport}
        reportType={"MLR"}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
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

  test("AddEditReportModal shows the contents", () => {
    expect(screen.getByText("Add a Program")).toBeTruthy();
    expect(screen.getByText("Save")).toBeTruthy();
  });

  test("AddEditReportModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditReportModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal functionality for MCPAR", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = async (form: any) => {
    const programNameField = form.querySelector("[name='programName']")!;
    await userEvent.type(programNameField, "fake program name");
    const startDateField = form.querySelector(
      "[name='reportingPeriodStartDate']"
    )!;
    await userEvent.type(startDateField, "1/1/2022");
    const endDateField = form.querySelector("[name='reportingPeriodEndDate']")!;
    await userEvent.type(endDateField, "12/31/2022");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
  };

  test("Adding a new report", async () => {
    mockLDFlags.setDefault({ yoyCopy: true });
    const result = await render(modalComponent);
    const form = result.getByTestId("add-edit-report-form");
    const header = screen.getByRole("heading", { level: 1 });
    expect(header.textContent).toEqual("Add / Copy a Program");
    const copySourceId = form.querySelector("[name='copySourceId']")!;
    expect(copySourceId).toHaveProperty("disabled", false);
    await fillForm(form);
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Editing an existing report", async () => {
    mockLDFlags.setDefault({ yoyCopy: true });
    const result = await render(modalComponentWithSelectedReport);
    const form = result.getByTestId("add-edit-report-form");
    const copySourceId = form.querySelector("[name='copySourceId']")!;
    expect(copySourceId).toHaveProperty("disabled", true);
    await fillForm(form);
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal functionality for MLR", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = async (form: any) => {
    const programNameField = form.querySelector("[name='programName']")!;
    await userEvent.type(programNameField, "fake program name");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
  };

  test("Adding a new report", async () => {
    const result = await render(mlrModalComponent);
    const form = result.getByTestId("add-edit-report-form");
    await fillForm(form);
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Editing an existing report", async () => {
    const result = await render(mlrModalComponentWithSelectedReport);
    const form = result.getByTestId("add-edit-report-form");
    await fillForm(form);
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
