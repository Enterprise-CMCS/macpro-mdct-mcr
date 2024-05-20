import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { AddEditReportModal, ReportContext } from "components";
import {
  mockLDFlags,
  mockMcparReport,
  mockMcparReportContext,
  mockMcparReportStore,
  mockMlrReport,
  mockMlrReportContext,
  mockMlrReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { convertDateUtcToEt, useStore } from "utils";

const mockCreateReport = jest.fn();
const mockUpdateReport = jest.fn();
const mockFetchReportsByState = jest.fn();
const mockCloseHandler = jest.fn();

const mockedMcparReportContext = {
  ...mockMcparReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

const mockedMlrReportContext = {
  ...mockMlrReportContext,
  createReport: mockCreateReport,
  updateReport: mockUpdateReport,
  fetchReportsByState: mockFetchReportsByState,
  isReportPage: true,
};

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedMcparReportContext}>
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

// a similar assignment is performed in DashboardPage and is needed here to make sure the modal form hydrates
const mockSelectedMcparReport = {
  ...mockMcparReport,
  fieldData: {
    programName: mockMcparReport.programName,
    reportingPeriodEndDate: convertDateUtcToEt(
      mockMcparReport.reportingPeriodEndDate
    ),
    reportingPeriodStartDate: convertDateUtcToEt(
      mockMcparReport.reportingPeriodStartDate
    ),
    combinedData: mockMcparReport.combinedData,
    programIsPCCM: mockMcparReport?.programIsPCCM,
  },
};

const modalComponentWithSelectedReport = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedMcparReportContext}>
      <AddEditReportModal
        activeState="AB"
        selectedReport={mockSelectedMcparReport}
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
    <ReportContext.Provider value={mockedMlrReportContext}>
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
    <ReportContext.Provider value={mockedMlrReportContext}>
      <AddEditReportModal
        activeState="AB"
        selectedReport={mockMlrReport}
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
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
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
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
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
    const isPccmNo = screen.getByLabelText("No") as HTMLInputElement;
    if (!isPccmNo.disabled) {
      await userEvent.click(isPccmNo);
    }
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
  };

  test("Adding a new report", async () => {
    mockLDFlags.setDefault({ yoyCopy: true });
    const result = await render(modalComponent);
    const form = result.getByTestId("add-edit-report-form");
    const header = screen.getByRole("heading", { level: 1 });
    expect(header.textContent).toEqual("Add / Copy a MCPAR");
    const copyFieldDataSourceId = form.querySelector(
      "[name='copyFieldDataSourceId']"
    )!;
    expect(copyFieldDataSourceId).toHaveProperty("disabled", false);
    await fillForm(form);
    await expect(mockCreateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("Edit modal hydrates with report info and disables fields", async () => {
    mockLDFlags.setDefault({ yoyCopy: true });
    const result = await render(modalComponentWithSelectedReport);
    const form = result.getByTestId("add-edit-report-form");
    const copyFieldDataSourceId = form.querySelector(
      "[name='copyFieldDataSourceId']"
    )!;
    const programIsPCCMField = form.querySelectorAll("[name='programIsPCCM']")!;
    // yoy copy and pccm fields are disabled
    expect(copyFieldDataSourceId).toHaveProperty("disabled", true);
    expect(programIsPCCMField[0]).toHaveProperty("disabled", true);
    expect(programIsPCCMField[1]).toHaveProperty("disabled", true);
    // hydrated values are in the modal
    const programNameField = form.querySelector("[name='programName']")!;
    const startDateField = form.querySelector(
      "[name='reportingPeriodStartDate']"
    )!;
    const endDateField = form.querySelector("[name='reportingPeriodEndDate']")!;
    expect(programNameField).toHaveProperty(
      "value",
      mockMcparReport.programName
    );
    expect(startDateField).toHaveProperty(
      "value",
      convertDateUtcToEt(mockMcparReport.reportingPeriodStartDate)
    );
    expect(endDateField).toHaveProperty(
      "value",
      convertDateUtcToEt(mockMcparReport.reportingPeriodEndDate)
    );
    userEvent.click(screen.getByText("Cancel"));
  });

  test("Editing an existing report", async () => {
    mockLDFlags.setDefault({ yoyCopy: true });
    const result = await render(modalComponentWithSelectedReport);
    const form = result.getByTestId("add-edit-report-form");
    await fillForm(form);
    await expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditReportModal functionality for MLR", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMlrReportStore,
    });
  });
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
