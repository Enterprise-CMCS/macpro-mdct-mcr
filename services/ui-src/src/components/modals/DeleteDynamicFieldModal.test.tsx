import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
//components
import { DeleteDynamicFieldModal, ReportContext } from "components";
import { mockReportContext } from "utils/testing/setupJest";

const mockCloseHandler = jest.fn();
const mockRemoveRecord = jest.fn();

const modalComponent = (
  <ReportContext.Provider value={mockReportContext}>
    <DeleteDynamicFieldModal
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      removeRecord={mockRemoveRecord}
      entityType={"plans"}
    />
  </ReportContext.Provider>
);

describe("Test DeleteDynamicFieldModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DeleteDynamicFieldModal shows the contents", () => {
    expect(screen.queryAllByText("Delete Plan")[0]).toBeTruthy();
    expect(screen.getByText("Yes, delete Plan")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  test("DeleteDynamicFieldModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteDynamicFieldModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteDynamicFieldModal delete plan button can be clicked", async () => {
    fireEvent.click(screen.getByText("Yes, delete Plan"));
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
