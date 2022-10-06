import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { axe } from "jest-axe";
// components
import { DeleteEntityModal, ReportContext } from "components";
// utils
import {
  mockReport,
  mockReportContext,
  mockReportKeys,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";

jest.mock("react-uuid", () => jest.fn(() => "mock-id-2"));

const mockUpdateReport = jest.fn();
const mockCloseHandler = jest.fn();

const mockEntity = {
  id: "mock-id-1",
  "mock-modal-text-field": "mock input 1",
};

const mockedReportContext = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockReport,
    fieldData: {
      accessMeasures: [mockEntity],
    },
  },
};

const mockUpdateCallBaseline = {
  fieldData: mockedReportContext.report.fieldData,
  lastAlteredBy: undefined,
  reportStatus: "In progress",
};

const mockBadReportContext = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockReport,
    fieldData: {},
  },
};

const mockBadUpdateCallBaseline = {
  fieldData: mockBadReportContext.report.fieldData,
  lastAlteredBy: undefined,
  reportStatus: "In progress",
};

const modalComponent = (
  <ReportContext.Provider value={mockedReportContext}>
    <DeleteEntityModal
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
      entityType="accessMeasures"
      selectedEntity={mockEntity}
    />
  </ReportContext.Provider>
);

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
    expect(screen.getByText("Delete access measure?")).toBeTruthy();
    expect(screen.getByText("Yes, Delete Measure")).toBeTruthy();
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
    render(modalComponent);

    const submitButton = screen.getByRole("button", {
      name: "Yes, Delete Measure",
    });
    await userEvent.click(submitButton);

    const mockUpdateCallPayload = mockUpdateCallBaseline;
    mockUpdateCallPayload.fieldData.accessMeasures = [];

    await expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockUpdateCallPayload
    );
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test("DeleteEntityModal deletes handles empty fielddata", async () => {
    render(modalComponent);

    const submitButton = screen.getByRole("button", {
      name: "Yes, Delete Measure",
    });
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

describe("Test deleteProgramModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
