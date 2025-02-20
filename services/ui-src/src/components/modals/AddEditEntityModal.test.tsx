import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
// components
import { AddEditEntityModal, ReportContext } from "components";
// utils
import { useStore } from "utils";
import {
  mockModalDrawerReportPageVerbiage,
  mockModalForm,
  mockMcparReport,
  mockMcparReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
} from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

vi.mock("react-uuid", () => ({
  default: vi.fn(() => "mock-id-2"),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockUpdateReport = vi.fn();
const mockCloseHandler = vi.fn();

const mockEntity = {
  id: "mock-id-1",
  "mock-modal-text-field": "mock input 1",
};

const mockedReportContext = {
  ...mockMcparReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockMcparReport,
    fieldData: {
      accessMeasures: [mockEntity],
    },
  },
};

const modalComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockedReportContext}>
      <AddEditEntityModal
        entityType="accessMeasures"
        verbiage={mockModalDrawerReportPageVerbiage}
        form={mockModalForm}
        modalDisclosure={{
          isOpen: true,
          onClose: mockCloseHandler,
        }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<AddEditEntityModal />", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("AddEditEntityModal shows the contents", () => {
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.addEditModalAddTitle)
    ).toBeTruthy();
    expect(screen.getByText("mock modal text field")).toBeTruthy();
  });

  test("AddEditEntityModal cancel button closes modal", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("AddEditEntityModal close button closes modal", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  testA11y(modalComponent);
});
