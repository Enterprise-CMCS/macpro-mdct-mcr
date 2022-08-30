import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
//components
import { AddEditProgramModal, ReportContext } from "components";

const closeHandler = jest.fn();

const activeState = "AL";

const mockReportMethods = {
  setReport: jest.fn(() => {}),
  setReportData: jest.fn(() => {}),
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
  fetchReportsByState: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  report: {},
  reportData: {},
  reportsByState: [],
  errorMessage: "",
};

const modalComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <AddEditProgramModal
      activeState={activeState}
      selectedReportId={undefined}
      modalDisclosure={{
        isOpen: true,
        onClose: closeHandler,
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

  test("AddEditProgramModals close button can be clicked", () => {
    fireEvent.click(screen.queryAllByText("Close")[0]);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditProgramModals close button can be clicked", () => {
    fireEvent.click(screen.queryAllByText("Close")[1]);
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditProgramModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
