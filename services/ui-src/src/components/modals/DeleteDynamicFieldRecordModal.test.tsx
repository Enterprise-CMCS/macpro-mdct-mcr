import { act, fireEvent, render, screen } from "@testing-library/react";
// components
import { DeleteDynamicFieldRecordModal, ReportContext } from "components";
// utils
import { mockMcparReportContext } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { EntityType } from "types";

const mockCloseHandler = jest.fn();
const mockDeleteRecord = jest.fn();

const modalComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <DeleteDynamicFieldRecordModal
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      deleteRecord={mockDeleteRecord}
      entityType={EntityType.PLANS}
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
    jest.clearAllMocks();
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

  testA11yAct(modalComponent);
});
