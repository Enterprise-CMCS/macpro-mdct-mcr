import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// components
import { DeleteDynamicFieldRecordModal, ReportContext } from "components";
// utils
import { mockReportContext } from "utils/testing/setupJest";

const mockCloseHandler = jest.fn();
const mockDeleteRecord = jest.fn();

const modalComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <DeleteDynamicFieldRecordModal
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      deleteRecord={mockDeleteRecord}
      entityType={"plans"}
    />
  </ReportContext.Provider>
);

describe("Test DeleteDynamicFieldRecordModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DeleteDynamicFieldRecordModal shows the contents", () => {
    expect(screen.queryAllByText("Delete Plan")[0]).toBeTruthy();
    expect(screen.getByText("Yes, delete Plan")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  test("DeleteDynamicFieldRecordModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteDynamicFieldRecordModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteDynamicFieldRecordModal delete plan button can be clicked", async () => {
    fireEvent.click(screen.getByText("Yes, delete Plan"));
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    await expect(mockDeleteRecord).toHaveBeenCalledTimes(1);
  });
});

describe("Test DeleteDynamicFieldRecordModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
