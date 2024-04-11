import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// components
import { DeleteEntityModal, ReportContext } from "components";
// utils
import {
  mockModalDrawerReportPageVerbiage,
  mockMcparReport,
  mockMcparReportContext,
  mockReportKeys,
  mockAccessMeasuresEntity,
  mockStateUserStore,
  mockMcparReportStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("react-uuid", () => jest.fn(() => "mock-id-2"));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockUpdateReport = jest.fn();
const mockCloseHandler = jest.fn();

const mockedReportContext = {
  ...mockMcparReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockMcparReport,
    fieldData: {
      accessMeasures: [mockAccessMeasuresEntity],
    },
  },
};

const mockUpdateCallBaseline = {
  fieldData: mockedReportContext.report.fieldData,
  metadata: {
    lastAlteredBy: "Thelonious States",
    status: "In progress",
  },
};

const mockBadReportContext = {
  ...mockMcparReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockMcparReport,
    fieldData: {},
  },
};

const mockBadUpdateCallBaseline = {
  fieldData: mockBadReportContext.report.fieldData,
  metadata: {
    lastAlteredBy: "Thelonious States",
    status: "In progress",
  },
};

const mockDeletedEntityStore = {
  ...mockMcparReportStore,
  ...(mockMcparReportStore.report!.fieldData = {
    accessMeasures: [],
  }),
};

const modalComponent = (
  <ReportContext.Provider value={mockedReportContext}>
    <DeleteEntityModal
      entityType="accessMeasures"
      selectedEntity={mockAccessMeasuresEntity}
      verbiage={mockModalDrawerReportPageVerbiage}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

const { deleteModalTitle, deleteModalConfirmButtonText } =
  mockModalDrawerReportPageVerbiage;

describe("Test DeleteEntityModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DeleteEntityModal shows the contents", () => {
    expect(screen.getByText(deleteModalTitle)).toBeTruthy();
    expect(screen.getByText(deleteModalConfirmButtonText)).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
  });

  test("DeleteEntityModal top close button can be clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteEntityModal bottom cancel button can be clicked", () => {
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test DeleteEntityModal functionality", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DeleteEntityModal deletes entity when deletion confirmed", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockDeletedEntityStore,
    });

    render(modalComponent);

    const submitButton = screen.getByText(deleteModalConfirmButtonText);
    await userEvent.click(submitButton);

    const mockUpdateCallPayload = mockUpdateCallBaseline;
    mockUpdateCallPayload.fieldData.accessMeasures = [];

    await expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockUpdateCallPayload
    );
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteEntityModal delete handles empty fielddata", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockDeletedEntityStore,
    });

    render(modalComponent);

    const submitButton = screen.getByText(deleteModalConfirmButtonText);
    await userEvent.click(submitButton);

    const mockUpdateCallPayload = mockBadUpdateCallBaseline;
    mockUpdateCallPayload.fieldData = { accessMeasures: [] };

    await expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockUpdateCallPayload
    );
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test DeleteEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
