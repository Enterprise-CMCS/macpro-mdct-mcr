import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
// components
import { DeleteDynamicFieldRecordModal, ReportContext } from "components";
// utils
import { mockMcparReportContext } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const mockCloseHandler = vi.fn();
const mockDeleteRecord = vi.fn();

const modalComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <DeleteDynamicFieldRecordModal
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      deleteRecord={mockDeleteRecord}
      entityType="plans"
    />
  </ReportContext.Provider>
);

describe("<DeleteDynamicFieldRecordModal />", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("DeleteDynamicFieldRecordModal shows the contents", () => {
    expect(screen.queryAllByText("Delete plan?")[0]).toBeTruthy();
    expect(screen.getByText("Yes, delete plan")).toBeTruthy();
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
    await act(async () => {
      fireEvent.click(screen.getByText("Yes, delete plan"));
      expect(mockDeleteRecord).toHaveBeenCalledTimes(1);
    });
  });

  testA11y(modalComponent);
});
