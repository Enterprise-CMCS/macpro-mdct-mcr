import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { AddEditEntityModal, ReportContext } from "components";
import {
  mockModalForm,
  mockReport,
  mockReportContext,
  mockReportKeys,
} from "utils/testing/setupJest";

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

const mockModalData = {
  addTitle: "mock-add-title",
  editTitle: "mock-edit-title",
  message: "mock-message",
  form: mockModalForm,
};

const modalComponent = (
  <ReportContext.Provider value={mockedReportContext}>
    <AddEditEntityModal
      entityType="accessMeasures"
      selectedEntity={undefined}
      modalData={mockModalData}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

const modalComponentWithSelectedEntity = (
  <ReportContext.Provider value={mockedReportContext}>
    <AddEditEntityModal
      entityType="accessMeasures"
      selectedEntity={mockEntity}
      modalData={mockModalData}
      modalDisclosure={{
        isOpen: true,
        onClose: mockCloseHandler,
      }}
    />
  </ReportContext.Provider>
);

describe("Test AddEditEntityModal", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(modalComponent);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("AddEditEntityModal shows the contents", () => {
    expect(screen.getByText("mock-add-title")).toBeTruthy();
    expect(screen.getByTestId("add-edit-entity-form")).toBeTruthy();
  });

  test("AddEditEntityModal close button closes modal", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditEntityModal functionality", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fillAndSubmitForm = async (form: any) => {
    // fill and submit form
    const textField = form.querySelector("[name='mock-modal-text-field']")!;
    await userEvent.type(textField, "mock input 2");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
  };

  test("Successfully adds new entity, even with existing entities", async () => {
    const result = await render(modalComponent);
    const form = result.getByTestId("add-edit-entity-form");
    await fillAndSubmitForm(form);

    const mockUpdateCallPayload = mockUpdateCallBaseline;
    mockUpdateCallPayload.fieldData.accessMeasures.push({
      id: "mock-id-2",
      "mock-modal-text-field": "mock input 2",
    });

    await expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockUpdateCallPayload
    );
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });

  test.only("Successfully edits an existing entity", async () => {
    const result = await render(modalComponentWithSelectedEntity);
    const form = result.getByTestId("add-edit-entity-form");
    await fillAndSubmitForm(form);
    const mockUpdateCallPayload = mockUpdateCallBaseline;

    mockUpdateCallPayload.fieldData.accessMeasures = [
      {
        id: "mock-id-1",
        "mock-modal-text-field": "mock input 2",
      },
    ];

    await expect(mockUpdateReport).toHaveBeenCalledWith(
      mockReportKeys,
      mockUpdateCallPayload
    );
    await expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditEntityModal accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
