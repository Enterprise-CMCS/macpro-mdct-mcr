import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { AddEditEntityModal, ReportContext } from "components";
import {
  mockModalDrawerReportPageVerbiage,
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

const mockUpdateCallPayload = {
  fieldData: mockedReportContext.report.fieldData,
  metadata: {
    lastAlteredBy: undefined,
    status: "In progress",
  },
};

const modalComponent = (
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
);

const modalComponentWithSelectedEntity = (
  <ReportContext.Provider value={mockedReportContext}>
    <AddEditEntityModal
      entityType="accessMeasures"
      selectedEntity={mockEntity}
      verbiage={mockModalDrawerReportPageVerbiage}
      form={mockModalForm}
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
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.addEditModalAddTitle)
    ).toBeTruthy();
    expect(screen.getByTestId("add-edit-entity-form")).toBeTruthy();
  });

  test("AddEditEntityModal close button closes modal", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockCloseHandler).toHaveBeenCalledTimes(1);
  });
});

describe("Test AddEditEntityModal functionality", () => {
  afterEach(() => {
    // reset payload to baseline with only mockEntity
    mockUpdateCallPayload.fieldData.accessMeasures = [mockEntity];
    jest.clearAllMocks();
  });

  const fillAndSubmitForm = async (form: any) => {
    // fill and submit form
    const textField = form.querySelector("[name='mock-modal-text-field']")!;
    await userEvent.clear(textField);
    await userEvent.type(textField, "mock input 2");
    const submitButton = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitButton);
  };

  test("Successfully adds new entity, even with existing entities", async () => {
    const result = await render(modalComponent);
    const form = result.getByTestId("add-edit-entity-form");
    await fillAndSubmitForm(form);

    const mockUpdateCallPayload = {
      fieldData: mockedReportContext.report.fieldData,
      metadata: {
        lastAlteredBy: undefined,
        status: "In progress",
      },
    };

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

  test("Successfully edits an existing entity", async () => {
    const result = await render(modalComponentWithSelectedEntity);
    const form = result.getByTestId("add-edit-entity-form");
    await fillAndSubmitForm(form);

    const mockUpdateCallPayload = {
      fieldData: mockedReportContext.report.fieldData,
      lastAlteredBy: undefined,
      reportStatus: "In progress",
    };

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
