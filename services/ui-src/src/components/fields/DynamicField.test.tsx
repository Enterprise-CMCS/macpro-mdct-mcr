import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { FormProvider, useForm } from "react-hook-form";
//components
import { DynamicField, ReportContext } from "components";
// utils
import { useUser } from "utils";
import {
  mockReportKeys,
  mockReport,
  mockReportContext,
  mockSanctionsEntity,
  mockStateUser,
  mockQualityMeasuresEntity,
  mockAdminUser,
} from "utils/testing/setupJest";
import { ReportStatus } from "types";

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const mockHydrationPlans = [
  {
    id: "mock-plan-id-1",
    name: "mock-plan-1",
  },
  {
    id: "mock-plan-id-2",
    name: "mock-plan-2",
  },
];
const mockUpdateReport = jest.fn();
const mockedReportContext = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockReport,
    fieldData: {
      plans: mockHydrationPlans,
      sanctions: [
        {
          ...mockSanctionsEntity,
          sanction_planName: {
            label: "sanction_planName",
            value: "mock-plan-id-1",
          },
        },
        {
          ...mockSanctionsEntity,
          sanction_planName: {
            label: "sanction_planName",
            value: "mock-plan-id-2",
          },
        },
      ],
      qualityMeasures: [
        {
          ...mockQualityMeasuresEntity,
          "qualityMeasure_plan_measureResults_mock-plan-id-1":
            "mock-response-1",
          "qualityMeasure_plan_measureResults_mock-plan-id-2":
            "mock-response-2",
        },
        {
          ...mockQualityMeasuresEntity,
          "qualityMeasure_plan_measureResults_mock-plan-id-1":
            "mock-response-1",
          "qualityMeasure_plan_measureResults_mock-plan-id-2":
            "mock-response-2",
        },
      ],
    },
  },
};

const MockForm = (props: any) => {
  const form = useForm({
    shouldFocusError: false,
  });
  return (
    <ReportContext.Provider value={mockedReportContext}>
      <FormProvider {...form}>
        <form id="uniqueId" onSubmit={form.handleSubmit(jest.fn())}>
          <DynamicField
            name="plans"
            label="test-label"
            hydrate={props.hydrationValue}
          />
        </form>
      </FormProvider>
    </ReportContext.Provider>
  );
};

const dynamicFieldComponent = (hydrationValue?: any) => (
  <MockForm hydrationValue={hydrationValue} />
);

describe("Test DynamicField component", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(dynamicFieldComponent());
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("DynamicField is visible", () => {
    const inputBoxLabel = screen.getByText("test-label");
    expect(inputBoxLabel).toBeVisible();
  });

  test("DynamicField append button is visible", () => {
    const appendButton = screen.getByText("Add a row");
    expect(appendButton).toBeVisible();
  });

  test("DynamicField append button adds a field", async () => {
    // click append
    const appendButton = screen.getByText("Add a row");
    await userEvent.click(appendButton);

    // verify there are now two text boxes
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();
  });

  test("DynamicField remove button removes a field", async () => {
    // click append
    const appendButton = screen.getByText("Add a row");
    await userEvent.click(appendButton);

    // verify there are now two text boxes
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // click remove
    const removeButton = screen.queryAllByTestId("removeButton")[1];
    await userEvent.click(removeButton);

    // click delete in modal
    const deleteButton = screen.getByText("Yes, delete plan");
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(removeButton).not.toBeVisible();
    expect(appendButton).toBeVisible();
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
  });

  test("DynamicField remove button can be clicked multiple times if a user doesnt submit confirmation to remove the input", async () => {
    // click append
    const appendButton = screen.getByText("Add a row");
    await userEvent.click(appendButton);

    // verify there are now two text boxes
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // click remove
    const removeButton = screen.queryAllByTestId("removeButton")[1];
    await userEvent.click(removeButton);

    // click cancel in modal
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // verify that the field can open modal again after closing
    await userEvent.click(removeButton);
    await userEvent.click(cancelButton);
    await userEvent.click(removeButton);
    await userEvent.click(cancelButton);

    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // Check deletion still works
    await userEvent.click(removeButton);

    // click delete in modal
    const deleteButton = screen.getByText("Yes, delete plan");
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
    expect(removeButton).not.toBeVisible();
    expect(appendButton).toBeVisible();
  });

  test("Removing all dynamic fields still leaves 1 open", async () => {
    // verify there is one input
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(1);

    // click remove
    const removeButton = screen.queryAllByTestId("removeButton")[0];
    await userEvent.click(removeButton);

    // click delete in modal
    const deleteButton = screen.getByText("Yes, delete plan");
    await userEvent.click(deleteButton);

    // verify that there is still one field available
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
    expect(removeButton).not.toBeVisible();
  });
});

describe("Test DynamicField entity deletion and deletion of associated data", () => {
  beforeEach(async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(dynamicFieldComponent(mockHydrationPlans));
    await act(async () => {
      await render(dynamicFieldComponent(mockHydrationPlans));
    });
  });
  it("Deletes entity and associated sanctions and quality measure responses", async () => {
    // delete mock-plan-1
    const removeButton = screen.queryAllByTestId("removeButton")[0];
    await userEvent.click(removeButton);
    const deleteButton = screen.getByText("Yes, delete plan");
    await userEvent.click(deleteButton);

    expect(mockUpdateReport).toHaveBeenCalledWith(
      { ...mockReportKeys, state: mockStateUser.user?.state },
      {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: mockStateUser.user?.full_name,
        },
        fieldData: {
          plans: [
            {
              id: "mock-plan-id-2",
              name: "mock-plan-2",
            },
          ],
          sanctions: [
            {
              ...mockSanctionsEntity,
              sanction_planName: {
                label: "sanction_planName",
                value: "mock-plan-id-2",
              },
            },
          ],
          qualityMeasures: [
            {
              ...mockQualityMeasuresEntity,
              "qualityMeasure_plan_measureResults_mock-plan-id-2":
                "mock-response-2",
            },
            {
              ...mockQualityMeasuresEntity,
              "qualityMeasure_plan_measureResults_mock-plan-id-2":
                "mock-response-2",
            },
          ],
        },
      }
    );
  });
});

describe("Test typing into DynamicField component", () => {
  test("DynamicField accepts input", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dynamicFieldComponent());
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
    expect(firstDynamicField).toBeVisible();
    await userEvent.type(firstDynamicField, "123");
    expect(firstDynamicField.value).toEqual("123");
  });
});

describe("Test DynamicField Autosave Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Does not autosave when not state user", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    const result = render(dynamicFieldComponent());
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
    expect(firstDynamicField).toBeVisible();
    await userEvent.type(firstDynamicField, "123");
    await userEvent.tab();
    expect(mockUpdateReport).toHaveBeenCalledTimes(0);
    expect(firstDynamicField.value).toBe("123");
  });

  test("Autosaves when state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dynamicFieldComponent());
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
    expect(firstDynamicField).toBeVisible();
    await userEvent.type(firstDynamicField, "123");
    await userEvent.tab();
    expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    expect(firstDynamicField.value).toBe("123");
  });

  test("DynamicField sets empty value when given a bad input for autosaving", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dynamicFieldComponent());
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
    expect(firstDynamicField).toBeVisible();
    firstDynamicField.value = "   ";
    expect(firstDynamicField.value).toBe("   ");
    await userEvent.click(firstDynamicField);
    await userEvent.tab();
    expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    expect(mockUpdateReport).lastCalledWith(
      { id: "mock-report-id", state: "MN" },
      {
        fieldData: {
          plans: [{ id: firstDynamicField.id, name: "" }],
        },
        metadata: { lastAlteredBy: "Thelonious States", status: "In progress" },
      }
    );
  });

  test("DynamicField handles blanked fields after it was filled out", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dynamicFieldComponent());
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
    expect(firstDynamicField).toBeVisible();
    firstDynamicField.value = "Plans";
    expect(firstDynamicField.value).toBe("Plans");
    await userEvent.click(firstDynamicField);
    await userEvent.clear(firstDynamicField);
    await userEvent.tab();
    expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    expect(mockUpdateReport).lastCalledWith(
      { id: "mock-report-id", state: "MN" },
      {
        fieldData: {
          plans: [{ id: firstDynamicField.id, name: "" }],
        },
        metadata: { lastAlteredBy: "Thelonious States", status: "In progress" },
      }
    );
  });
});

describe("Test DynamicField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicFieldComponent());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
