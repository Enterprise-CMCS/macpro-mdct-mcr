import { act, fireEvent, render, screen } from "@testing-library/react";
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
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { EntityType } from "types";

jest.mock("react-uuid", () => jest.fn(() => "mock-id-2"));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockUpdateReport = jest.fn();
const mockCloseHandler = jest.fn();

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
        entityType={EntityType.ACCESS_MEASURES}
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
    jest.clearAllMocks();
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

  testA11yAct(modalComponent);
});
