import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
// components
import { DynamicField, ReportContext } from "components";
// constants
import { DEFAULT_ANALYSIS_METHODS } from "../../constants";
// types
import { EntityType, ReportStatus } from "types";
// utils
import { useStore } from "utils";
import {
  mockReportKeys,
  mockMcparReport,
  mockMcparReportContext,
  mockSanctionsEntity,
  mockStateUserStore,
  mockQualityMeasuresEntity,
  mockAdminUserStore,
  mockMcparReportStore,
  mockNaaarReportWithAnalysisMethodsContext,
  mockNaaarAnalysisMethodsReportStore,
  mockAnalysisMethodEntityStore,
  mockNaaarReportWithAnalysisMethods,
  mockNaaarReportWithCustomAnalysisMethodsContext,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
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

const mockHydrationPlan = [
  {
    id: "mock-plan-id-1",
    name: "mock-plan-1",
  },
];

const mockHydrationIlos = [
  {
    id: "mock-ilos-id-1",
    name: "mock-ilos-1",
  },
];

const mockUpdateReport = jest.fn();

const mockedReportContext = {
  ...mockMcparReportContext,
  updateReport: mockUpdateReport,
  report: mockMcparReport,
};

const MockForm = (props: any) => {
  const form = useForm({
    shouldFocusError: false,
  });
  return (
    <ReportContext.Provider value={props?.customContext ?? mockedReportContext}>
      <FormProvider {...form}>
        <form id="uniqueId" onSubmit={form.handleSubmit(jest.fn())}>
          <DynamicField
            name={EntityType.PLANS}
            label="test-label"
            hydrate={props.hydrationValue}
          />
        </form>
      </FormProvider>
    </ReportContext.Provider>
  );
};

const dynamicFieldComponent = (hydrationValue?: any, customContext?: any) => (
  <MockForm hydrationValue={hydrationValue} customContext={customContext} />
);

const MockIlosForm = (props: any) => {
  const form = useForm({
    shouldFocusError: false,
  });
  return (
    <ReportContext.Provider value={mockedReportContext}>
      <FormProvider {...form}>
        <form id="uniqueId" onSubmit={form.handleSubmit(jest.fn())}>
          <DynamicField
            name={EntityType.ILOS}
            label="test-label"
            hydrate={props.hydrationValue}
          />
        </form>
      </FormProvider>
    </ReportContext.Provider>
  );
};

const dynamicIlosFieldComponent = (hydrationValue?: any) => (
  <MockIlosForm hydrationValue={hydrationValue} />
);

describe("<DynamicField />", () => {
  describe("Test DynamicField component", () => {
    beforeEach(async () => {
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
      await act(async () => {
        await userEvent.click(appendButton);
      });

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByText("test-label");
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();
    });

    test("DynamicField remove button removes a field", async () => {
      // click append
      const appendButton = screen.getByText("Add a row");
      await act(async () => {
        await userEvent.click(appendButton);
      });

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByText("test-label");
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // click remove
      const removeButton = screen.queryAllByTestId("removeButton")[1];
      await act(async () => {
        await userEvent.click(removeButton);
      });

      // click delete in modal
      const deleteButton = screen.getByText("Yes, delete plan");
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      // verify that the field is removed
      const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
      expect(removeButton).not.toBeVisible();
      expect(appendButton).toBeVisible();
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
    });

    test("DynamicField remove button can be clicked multiple times if a user doesnt submit confirmation to remove the input", async () => {
      // click append
      const appendButton = screen.getByText("Add a row");
      await act(async () => {
        await userEvent.click(appendButton);
      });

      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByText("test-label");
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // click remove
      const removeButton = screen.queryAllByTestId("removeButton")[1];
      await act(async () => {
        await userEvent.click(removeButton);
      });

      // click cancel in modal
      const cancelButton = screen.getByText("Cancel");
      await act(async () => {
        await userEvent.click(cancelButton);
      });
      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // verify that the field can open modal again after closing
      await act(async () => {
        await userEvent.click(removeButton);
        await userEvent.click(cancelButton);
        await userEvent.click(removeButton);
        await userEvent.click(cancelButton);
      });

      expect(inputBoxLabel).toHaveLength(2);
      expect(appendButton).toBeVisible();

      // Check deletion still works
      await act(async () => {
        await userEvent.click(removeButton);
      });

      // click delete in modal
      const deleteButton = screen.getByText("Yes, delete plan");
      await act(async () => {
        await userEvent.click(deleteButton);
      });

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
      await act(async () => {
        await userEvent.click(removeButton);
      });

      // click delete in modal
      const deleteButton = screen.getByText("Yes, delete plan");
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      // verify that there is still one field available
      const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
      expect(inputBoxLabelAfterRemove).toHaveLength(1);
      expect(removeButton).not.toBeVisible();
    });
  });

  describe("Test DynamicField entity deletion and deletion of associated data", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("Deletes entity and associated sanctions and quality measure responses if state user", async () => {
      await act(async () => {
        await render(dynamicFieldComponent(mockHydrationPlans));
      });
      // delete mock-plan-1
      const removeButton = screen.queryAllByTestId("removeButton")[0];
      await act(async () => {
        await userEvent.click(removeButton);
      });
      const deleteButton = screen.getByText("Yes, delete plan");
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      expect(mockUpdateReport).toHaveBeenCalledWith(
        { ...mockReportKeys, state: mockStateUserStore.user?.state },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: mockStateUserStore.user?.full_name,
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
            standards: [],
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

    test("Deletes ILOS entity and associated fields from the associated plan if state user", async () => {
      await act(async () => {
        await render(dynamicIlosFieldComponent(mockHydrationIlos));
      });

      // delete mock-ilos-1
      const removeButton = screen.queryAllByTestId("removeButton")[0];
      await act(async () => {
        await userEvent.click(removeButton);
      });
      const deleteButton = screen.getByText("Yes, delete ILOS");
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      expect(mockUpdateReport).toHaveBeenCalledWith(
        { ...mockReportKeys, state: mockStateUserStore.user?.state },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: mockStateUserStore.user?.full_name,
          },
          fieldData: {
            ilos: [],
            plans: [
              {
                id: "mock-plan-id-1",
                "mock-drawer-text-field": "example-explanation",
                name: "mock-plan-name-1",
              },
              {
                id: "mock-plan-id-2",
                name: "mock-plan-name-2",
                plan_ilosOfferedByPlan: [
                  {
                    key: "mock-radio",
                    value: "Yes",
                  },
                ],
                plan_ilosUtilizationByPlan: [],
              },
            ],
            qualityMeasures: [
              ...mockMcparReportStore.report!.fieldData.qualityMeasures,
            ],
            sanctions: [...mockMcparReportStore.report!.fieldData.sanctions],
            standards: [],
          },
        }
      );
    });

    test("If there's no ILOS entities left, associated plan responses are cleared from field data", async () => {
      const mcparReportWithoutIlos = {
        ...mockMcparReport,
        fieldData: {
          ...mockMcparReport.fieldData,
          ilos: [],
        },
      };

      const mcparReportStoreWithoutIlos = {
        ...mockMcparReportStore,
        report: mcparReportWithoutIlos,
      };

      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mcparReportStoreWithoutIlos,
      });

      await act(async () => {
        await render(dynamicIlosFieldComponent(mockHydrationIlos));
      });

      // delete mock-ilos-1
      const removeButton = screen.queryAllByTestId("removeButton")[0];
      await act(async () => {
        await userEvent.click(removeButton);
      });
      const deleteButton = screen.getByText("Yes, delete ILOS");
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
    });

    test("Deletes plan and associated analysis methods plan in NAAAR if state user", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarAnalysisMethodsReportStore,
        report: mockNaaarReportWithCustomAnalysisMethodsContext.report,

        ...mockAnalysisMethodEntityStore,
      });

      await act(async () => {
        await render(
          dynamicFieldComponent(mockHydrationPlan, mockedReportContext)
        );
      });

      // delete mock-plan-1
      const removeButton = screen.getByRole("button", {
        name: "Delete mock-plan-1",
      });
      await act(async () => {
        await userEvent.click(removeButton);
      });
      const deleteButton = screen.getByRole("button", {
        name: "Yes, delete plan",
      });
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      expect(mockUpdateReport).toHaveBeenCalledWith(
        {
          ...mockReportKeys,
          reportType: "NAAAR",
          state: mockStateUserStore.user?.state,
        },
        {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: mockStateUserStore.user?.full_name,
          },
          fieldData: {
            plans: [],
            analysisMethods: [
              {
                ...DEFAULT_ANALYSIS_METHODS[0],
              },
              {
                ...DEFAULT_ANALYSIS_METHODS[1],
              },
              {
                id: "custom-method",
                custom_analysis_method_name: "Custom Method",
              },
            ],
            standards: [],
          },
        }
      );
    });

    test("Removes utilized analysis method properties when applicable plan is deleted", async () => {
      const plan = {
        id: "mock-plan-id-1",
        name: "Plan A",
      };
      const context = {
        ...mockNaaarReportWithAnalysisMethodsContext,
        updateReport: mockUpdateReport,
        report: {
          ...mockNaaarReportWithAnalysisMethods,
          fieldData: {
            plans: [plan],
            analysisMethods: [
              {
                id: "analysis_method_applicable_plans-mock-plan-id-1",
                name: "Utilized Method",
                analysis_applicable: [
                  { id: "mock-analysis-applicable", value: "Yes" },
                ],
                analysis_method_frequency: [
                  { key: "mock-freq", value: "Monthly" },
                ],
                analysis_method_applicable_plans: [
                  {
                    key: plan.id,
                    name: plan.name,
                  },
                ],
              },
            ],
          },
        },
      };

      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarAnalysisMethodsReportStore,
        report: context.report,
        ...mockAnalysisMethodEntityStore,
      });

      await act(async () => {
        render(dynamicFieldComponent([plan], context));
      });
      const deleteButton = screen.getByRole("button", {
        name: `Delete ${plan.name}`,
      });
      await act(async () => {
        await userEvent.click(deleteButton);
      });
      const confirmDeleteButton = screen.getByRole("button", {
        name: "Yes, delete plan",
      });
      await userEvent.click(confirmDeleteButton);

      const updateArg = mockUpdateReport.mock.calls[0][1];
      const updatedMethods = updateArg.fieldData.analysisMethods;

      const updated = updatedMethods.find(
        (method: { id: string }) => method.id === "mock-analysis-method-1-id"
      );

      expect(updated).toBeUndefined();
    });

    test("Admin users can't delete plans", async () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      render(dynamicFieldComponent(mockHydrationPlans));
      await act(async () => {
        await render(dynamicFieldComponent(mockHydrationPlans));
      });
      // delete mock-plan-1
      const removeButton = screen.queryAllByTestId("removeButton")[0];
      await act(async () => {
        await userEvent.click(removeButton);
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(0);
    });
  });

  describe("Test typing into DynamicField component", () => {
    test("DynamicField accepts input", async () => {
      const result = render(dynamicFieldComponent());
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='plans[0]']")!;
      expect(firstDynamicField).toBeVisible();
      await act(async () => {
        await userEvent.type(firstDynamicField, "123");
      });
      expect(firstDynamicField.value).toEqual("123");
    });
  });

  describe("Test DynamicField Autosave Functionality", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("Autosaves when state user", async () => {
      const result = render(dynamicFieldComponent());
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='plans[0]']")!;
      expect(firstDynamicField).toBeVisible();
      await act(async () => {
        await userEvent.type(firstDynamicField, "123");
        await userEvent.tab();
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(firstDynamicField.value).toBe("123");
    });

    test("DynamicField handles blanked fields after it was filled out", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
      const result = render(dynamicFieldComponent());
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='plans[0]']")!;
      expect(firstDynamicField).toBeVisible();
      await act(async () => {
        await userEvent.type(firstDynamicField, "Plans");
        await userEvent.tab();
      });
      expect(firstDynamicField.value).toBe("Plans");
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(mockUpdateReport).lastCalledWith(
        { reportType: "MCPAR", id: "mock-report-id", state: "MN" },
        {
          fieldData: {
            plans: [{ id: firstDynamicField.id, name: "Plans" }],
          },
          metadata: {
            lastAlteredBy: "Thelonious States",
            status: "In progress",
          },
        }
      );
      await act(async () => {
        await userEvent.click(firstDynamicField);
        await userEvent.clear(firstDynamicField);
        await userEvent.tab();
      });
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(mockUpdateReport).lastCalledWith(
        { reportType: "MCPAR", id: "mock-report-id", state: "MN" },
        {
          fieldData: {
            plans: [{ id: firstDynamicField.id, name: "" }],
          },
          metadata: {
            lastAlteredBy: "Thelonious States",
            status: "In progress",
          },
        }
      );
    });

    test("Autosaves and show correct number of plan inputs when bluring into adding a row", async () => {
      const result = render(dynamicFieldComponent(mockHydrationPlans));
      // click append
      const appendButton = screen.getByText("Add a row");
      await act(async () => {
        await userEvent.click(appendButton);
      });
      const firstDynamicField: HTMLInputElement =
        result.container.querySelector("[name='plans[2]']")!;
      expect(firstDynamicField).toBeVisible();
      await act(async () => {
        await userEvent.type(firstDynamicField, "123");
        await userEvent.click(appendButton);
      });
      // verify there are now two text boxes
      const inputBoxLabel = screen.getAllByText("test-label");
      expect(inputBoxLabel).toHaveLength(4);
      expect(appendButton).toBeVisible();
      expect(firstDynamicField.value).toBe("123");
      expect(mockUpdateReport).toHaveBeenCalledTimes(1);
      expect(mockUpdateReport).lastCalledWith(
        { reportType: "MCPAR", id: "mock-report-id", state: "MN" },
        {
          fieldData: {
            plans: [
              {
                id: "mock-plan-id-1",
                name: "mock-plan-1",
              },
              {
                id: "mock-plan-id-2",
                name: "mock-plan-2",
              },
              { id: firstDynamicField.id, name: "123" },
            ],
          },
          metadata: {
            lastAlteredBy: "Thelonious States",
            status: "In progress",
          },
        }
      );
    });
  });

  testA11yAct(dynamicFieldComponent());
});
