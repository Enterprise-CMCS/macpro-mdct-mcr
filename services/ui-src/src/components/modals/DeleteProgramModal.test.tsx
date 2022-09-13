import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
//components
import { DeleteProgramModal, ReportContext } from "components";
import { mockReportContext } from "utils/testing/setupJest";

const mockCloseHandler = jest.fn();
const mockRemoveReport = jest.fn();
const mockFetchReportsByState = jest.fn();

const mockedReportContext = {
  ...mockReportContext,
  removeReport: mockRemoveReport,
  fetchReportsByState: mockFetchReportsByState,
};

const modalComponent = (
  <ReportContext.Provider value={mockedReportContext}>
    <DeleteProgramModal
      activeState="AB"
      selectedReportMetadata={{ reportId: "mock-report-id" }}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

describe("Test DeleteProgramModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DeleteProgramModal shows the contents", () => {
    expect(screen.queryAllByText("Delete")[0]).toBeTruthy();
    expect(screen.getByText("Yes, delete program")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  test("DeleteProgramModals top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteProgramModals bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteProgramModals delete program button can be clicked", async () => {
    fireEvent.click(screen.getByText("Yes, delete program"));
    await expect(mockRemoveReport).toHaveBeenCalledTimes(1);
    await expect(mockFetchReportsByState).toHaveBeenCalledTimes(1);
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test deleteProgramModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
