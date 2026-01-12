import { EntityType } from "types";
import { mockStateUserStore } from "utils/testing/setupJest";
import {
  autosaveFieldData,
  EntityContextShape,
  getAutosaveFields,
  isFieldChanged,
} from "./autosave";

const mockTrigger = jest.fn();

const mockForm: any = {
  trigger: mockTrigger,
};

const report = {
  id: "reportId",
  reportType: "MCPAR",
  updateReport: jest.fn().mockResolvedValue(true),
};
const user = {
  userName: mockStateUserStore.user?.email,
  state: mockStateUserStore.user?.state,
};

const fields = [
  {
    name: "field1",
    type: "fieldType",
    value: "value1",
    hydrationValue: "value1",
    defaultValue: "defaultValue1",
    overrideCheck: false,
  },
  {
    name: "field2",
    type: "fieldType",
    value: "value2",
    hydrationValue: "value3",
    defaultValue: "defaultValue2",
    overrideCheck: false,
  },
];

const mockEntityContext: EntityContextShape = {
  updateEntities: jest.fn(() => {
    return [{ id: "foo", testField: 1, field1: "value1", field2: "value2" }];
  }),
  entities: [{ id: "foo", testField: 1 }],
  entityType: EntityType.PROGRAM,
  selectedEntity: { id: "foo" },
};

describe("autosaveFieldData", () => {
  it("should save fieldData if fields have been updated", async () => {
    mockTrigger.mockResolvedValue(true);
    await autosaveFieldData({ form: mockForm, fields, report, user });
    expect(mockForm.trigger).toHaveBeenCalledWith("field2");
    expect(report.updateReport).toHaveBeenCalledWith(
      { reportType: "MCPAR", id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "value2" },
      }
    );
  });

  it("should save fieldData with default value if field is invalid", async () => {
    mockTrigger.mockResolvedValue(false);
    await autosaveFieldData({ form: mockForm, fields, report, user });
    expect(mockForm.trigger).toHaveBeenCalledWith("field2");
    expect(report.updateReport).toHaveBeenCalledWith(
      { reportType: "MCPAR", id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "defaultValue2" },
      }
    );
  });

  it("should save fieldData with default value if no there are no fields to save", async () => {
    mockTrigger.mockResolvedValue(false);
    await autosaveFieldData({ form: mockForm, fields: [], report, user });
    expect(mockForm.trigger).toHaveBeenCalledWith("field2");
    expect(report.updateReport).toHaveBeenCalledWith(
      { reportType: "MCPAR", id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "defaultValue2" },
      }
    );
  });

  it("should save fieldData with value if validity check is overridden", async () => {
    fields[1].overrideCheck = true;
    await autosaveFieldData({ form: mockForm, fields, report, user });
    expect(report.updateReport).toHaveBeenCalledWith(
      { reportType: "MCPAR", id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: { field2: "value2" },
      }
    );
  });

  it("should update and save all entities when an entity context is passed", async () => {
    await autosaveFieldData({
      form: mockForm,
      fields,
      report,
      user,
      entityContext: mockEntityContext,
    });
    expect(report.updateReport).toHaveBeenCalledWith(
      { reportType: "MCPAR", id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: {
          program: [
            { id: "foo", testField: 1, field1: "value1", field2: "value2" },
          ],
        },
      }
    );
  });

  it("should handle Prior Authorization use case", async () => {
    const priorAuthFields = [
      {
        name: "reportingDataPriorToJune2026",
        type: "radio",
        value: "Not reporting on data",
        hydrationValue: "Yes",
        defaultValue: "",
        overrideCheck: false,
      },
    ];
    const reportWithPlans = {
      id: "reportId",
      reportType: "MCPAR",
      fieldData: {
        plans: [],
      },
      updateReport: jest.fn().mockResolvedValue(true),
    };
    mockTrigger.mockResolvedValue(true);
    await autosaveFieldData({
      form: mockForm,
      fields: priorAuthFields,
      report: reportWithPlans,
      user,
    });
    expect(mockForm.trigger).toHaveBeenCalledWith(
      "plan_priorAuthorizationReporting"
    );
    expect(reportWithPlans.updateReport).toHaveBeenCalledWith(
      { reportType: "MCPAR", id: "reportId", state: "MN" },
      {
        metadata: {
          status: "In progress",
          lastAlteredBy: "stateuser@test.com",
        },
        fieldData: {
          plans: [],
          plan_priorAuthorizationReporting: "Not reporting on data",
        },
      }
    );
  });
});

it("should handle NAAAR plans use case", async () => {
  const planFields = [
    {
      name: "plans",
      type: "dynamic",
      value: [
        {
          id: "mockPlanId",
          name: "New Plan Name",
        },
      ],
      hydrationValue: [
        {
          id: "mockPlanId",
          name: "New Plan Name",
        },
      ],
      overrideCheck: true,
    },
  ];
  const reportWithAnalysisMethods = {
    id: "reportId",
    reportType: "NAAAR",
    fieldData: {
      plans: [
        {
          id: "mockPlanId",
          name: "Old Plan Name",
        },
      ],
      analysisMethods: [
        {
          id: "mockAnalysisMethod-plan",
          analysis_method_applicable_plans: [
            {
              key: "analysis_method_applicable_plans-mockPlanId",
              value: "Old Plan Name",
            },
          ],
        },
        {
          id: "mockAnalysisMethod-badPlan",
          analysis_method_applicable_plans: [
            {
              key: "analysis_method_applicable_plans-badPlanId",
              value: "Bad Plan Name",
            },
          ],
        },
        {
          id: "mockAnalysisMethod-noPlan",
        },
      ],
    },
    updateReport: jest.fn().mockResolvedValue(true),
  };
  mockTrigger.mockResolvedValue(true);
  await autosaveFieldData({
    form: mockForm,
    fields: planFields,
    report: reportWithAnalysisMethods,
    user,
  });
  expect(mockForm.trigger).toHaveBeenCalledWith("plans");
  expect(reportWithAnalysisMethods.updateReport).toHaveBeenCalledWith(
    { reportType: "NAAAR", id: "reportId", state: "MN" },
    {
      metadata: {
        status: "In progress",
        lastAlteredBy: "stateuser@test.com",
      },
      fieldData: {
        plans: [
          {
            id: "mockPlanId",
            name: "New Plan Name",
          },
        ],
        analysisMethods: [
          {
            id: "mockAnalysisMethod-plan",
            analysis_method_applicable_plans: [
              {
                key: "analysis_method_applicable_plans-mockPlanId",
                value: "New Plan Name",
              },
            ],
          },
          {
            id: "mockAnalysisMethod-badPlan",
            analysis_method_applicable_plans: [],
          },
          {
            id: "mockAnalysisMethod-noPlan",
          },
        ],
      },
    }
  );
});

describe("ifFieldWasUpdated", () => {
  it("should return 2 if dynamic field has value and is different from hydrationValue", () => {
    const dynamicField = {
      name: "fieldName",
      type: "dynamic",
      value: [{ name: "" }, { name: "value2" }],
      hydrationValue: [
        { name: "hydration-value1" },
        { name: "hydration-value2" },
      ],
    };

    expect(isFieldChanged(dynamicField)).toBe(2);
  });

  it("should return 0 if dynamic field has no value", () => {
    const dynamicField = {
      name: "fieldName",
      type: "dynamic",
      value: [],
      hydrationValue: [
        { name: "hydration-value1" },
        { name: "hydration-value2" },
      ],
    };

    expect(isFieldChanged(dynamicField)).toBe(0);
  });

  it("should return true if non-dynamic field value is different from hydrationValue", () => {
    const nonDynamicField = {
      name: "fieldName",
      type: "non-dynamic",
      value: "value",
      hydrationValue: "hydration-value",
    };

    expect(isFieldChanged(nonDynamicField)).toBe(true);
  });

  it("should return false if non-dynamic field value is same as hydrationValue", () => {
    const nonDynamicField = {
      name: "fieldName",
      type: "non-dynamic",
      value: "value",
      hydrationValue: "value",
    };

    expect(isFieldChanged(nonDynamicField)).toBe(false);
  });
});

describe("getAutosaveFields", () => {
  test("should return correct autosave fields", () => {
    expect(
      getAutosaveFields({
        name: "testField",
        type: "number",
        value: 1,
        defaultValue: 0,
        hydrationValue: 0,
      })
    ).toEqual([
      {
        name: "testField",
        type: "number",
        value: 1,
        defaultValue: 0,
        hydrationValue: 0,
        overrideCheck: undefined,
      },
    ]);
  });
});
