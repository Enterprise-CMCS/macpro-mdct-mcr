import {
  clearPlanMeasureData,
  dataModifications,
  handlePriorAuthorization,
  updatePlanNames,
  updatePlansInAnalysisMethods,
  updatePlansInExemptions,
} from "./dataModifications";
// types
import { ReportType } from "types";
import { FieldDataTuple } from "./autosave";

const testCases = {
  dataToWrite: {
    fieldData: {
      plans: [
        {
          id: "mock-plan-1",
          name: "Mock Plan 1",
        },
      ],
    },
  },
  updatePlansInAnalysisMethods: {
    reportFieldData: {
      analysisMethods: [
        {
          analysis_applicable: [
            {
              key: "analysis_applicable-mock",
              value: "Yes",
            },
          ],
          analysis_method_applicable_plans: [
            {
              key: "analysis_method_applicable_plans-mock-plan-1",
              value: "Applicable Mock Plan 1",
            },
            {
              key: "analysis_method_applicable_plans-mock-plan-2",
              value: "Applicable Mock Plan 2",
            },
          ],
          analysis_method_frequency: [
            {
              key: "analysis_method_frequency-mock",
              value: "Weekly",
            },
          ],
          isRequired: true,
        },
      ],
    },
    expectedResult: {
      fieldData: {
        analysisMethods: [
          {
            analysis_applicable: [
              {
                key: "analysis_applicable-mock",
                value: "Yes",
              },
            ],
            analysis_method_applicable_plans: [
              {
                key: "analysis_method_applicable_plans-mock-plan-1",
                value: "Mock Plan 1",
              },
            ],
            analysis_method_frequency: [
              {
                key: "analysis_method_frequency-mock",
                value: "Weekly",
              },
            ],
            isRequired: true,
          },
        ],
        plans: [
          {
            id: "mock-plan-1",
            name: "Mock Plan 1",
          },
        ],
      },
    },
  },
  updatePlansInExemptions: {
    reportFieldData: {
      plans: [
        {
          id: "mock-plan-1",
          name: "Mock Plan 1",
        },
      ],
      plansExemptFromQualityMeasures: [
        {
          key: "plansExemptFromQualityMeasures-mock-plan-1",
          value: "Exempt Mock Plan 1",
        },
        {
          key: "plansExemptFromQualityMeasures-mock-plan-2",
          value: "Exempt Mock Plan 2",
        },
      ],
    },
    expectedResult: {
      fieldData: {
        plans: [
          {
            id: "mock-plan-1",
            name: "Mock Plan 1",
          },
        ],
        plansExemptFromQualityMeasures: [
          {
            key: "plansExemptFromQualityMeasures-mock-plan-1",
            value: "Mock Plan 1",
          },
        ],
      },
    },
  },
};

describe("utils/autosave/dataModifications", () => {
  describe("dataModifications()", () => {
    test("updates MCPAR", () => {
      const input = dataModifications(
        ReportType.MCPAR,
        testCases.dataToWrite,
        testCases.updatePlansInExemptions.reportFieldData
      );

      expect(input).toEqual(testCases.updatePlansInExemptions.expectedResult);
    });

    test("updates MLR", () => {
      const reportFieldData = {};

      const input = dataModifications(
        ReportType.MLR,
        testCases.dataToWrite,
        reportFieldData
      );

      const expectedResult = {
        ...testCases.dataToWrite,
      };

      expect(input).toEqual(expectedResult);
    });

    test("updates NAAAR", () => {
      const input = dataModifications(
        ReportType.NAAAR,
        testCases.dataToWrite,
        testCases.updatePlansInAnalysisMethods.reportFieldData
      );

      expect(input).toEqual(
        testCases.updatePlansInAnalysisMethods.expectedResult
      );
    });
  });

  describe("handlePriorAuthorization()", () => {
    const dataToWrite = {
      id: "mock-id",
      fieldData: {
        plans: [
          {
            id: "mock-plan-1",
            name: "Mock Plan 1",
            plan_totalNumberOfStandardPARequests: 1,
          },
        ],
      },
    };
    const reportFieldData = {
      plans: [
        {
          id: "mock-plan-1",
          name: "Mock Plan 1",
          plan_totalNumberOfStandardPARequests: 1,
        },
      ],
    };

    test("allows prior authorization fields", () => {
      const fieldsToSave = [
        [
          "reportingDataPriorToJune2026",
          [
            {
              key: "mock-choice-yes",
              value: "Yes",
            },
          ],
        ],
        [
          "plans",
          [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
              plan_totalNumberOfStandardPARequests: 1,
            },
          ],
        ],
      ] as FieldDataTuple[];
      const input = handlePriorAuthorization(
        dataToWrite,
        reportFieldData,
        fieldsToSave
      );
      const expectedResult = {
        id: "mock-id",
        fieldData: {
          plans: [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
              plan_totalNumberOfStandardPARequests: 1,
            },
          ],
          reportingDataPriorToJune2026: [
            {
              key: "mock-choice-yes",
              value: "Yes",
            },
          ],
        },
      };

      expect(input).toEqual(expectedResult);
    });

    test("removes prior authorization fields", () => {
      const fieldsToSave = [
        [
          "reportingDataPriorToJune2026",
          [
            {
              key: "mock-choice-no",
              value: "No",
            },
          ],
        ],
        [
          "plans",
          [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
              plan_totalNumberOfStandardPARequests: 1,
            },
          ],
        ],
      ] as FieldDataTuple[];
      const input = handlePriorAuthorization(
        dataToWrite,
        reportFieldData,
        fieldsToSave
      );
      const expectedResult = {
        id: "mock-id",
        fieldData: {
          plans: [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
            },
          ],
          reportingDataPriorToJune2026: [
            {
              key: "mock-choice-no",
              value: "No",
            },
          ],
        },
      };

      expect(input).toEqual(expectedResult);
    });
  });

  describe("updatePlansInAnalysisMethods()", () => {
    test("updates plans in analysis_method_applicable_plans", () => {
      const input = updatePlansInAnalysisMethods(
        testCases.dataToWrite,
        testCases.updatePlansInAnalysisMethods.reportFieldData
      );
      expect(input).toEqual(
        testCases.updatePlansInAnalysisMethods.expectedResult
      );
    });

    test("does not modify dataToWrite", () => {
      const reportFieldData = {
        analysisMethods: [],
      };

      const input = updatePlansInAnalysisMethods(
        testCases.dataToWrite,
        reportFieldData
      );

      const expectedResult = {
        ...testCases.dataToWrite,
      };

      expect(input).toEqual(expectedResult);
    });
  });

  describe("updatePlansInExemptions()", () => {
    test("updates plans in plansExemptFromQualityMeasures", () => {
      const input = updatePlansInExemptions(
        testCases.dataToWrite,
        testCases.updatePlansInExemptions.reportFieldData
      );
      expect(input).toEqual(testCases.updatePlansInExemptions.expectedResult);
    });
  });

  describe("updatePlanNames()", () => {
    test("updates plan names", () => {
      const plans = [
        {
          key: "mock-plan-1",
          value: "Mock Plan 1",
        },
        {
          key: "mock-plan-2",
          value: "Mock Plan 2",
        },
      ];
      const planNames = {
        "mock-plan-1": "New Mock Plan 1",
      };
      const input = updatePlanNames(plans, planNames);
      const expectedResult = [
        {
          key: "mock-plan-1",
          value: "New Mock Plan 1",
        },
      ];

      expect(input).toEqual(expectedResult);
    });
  });

  describe("clearPlanMeasureData()", () => {
    test("clear plan measure data", () => {
      const mockDataToWrite = {
        fieldData: {},
      };
      const fieldKey = "TEST";
      const plans = [
        {
          id: "mock-plan-1",
          name: "Mock Plan 1",
          measures: {
            "measure-1": {},
          },
        },
      ];
      const exemptPlans = [
        { key: `${fieldKey}-${plans[0].id}`, name: plans[0].name },
      ];
      clearPlanMeasureData(mockDataToWrite, plans, exemptPlans, fieldKey);

      expect(mockDataToWrite).toEqual({
        fieldData: {
          plans: [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
              measures: undefined,
            },
          ],
        },
      });
    });
  });
});
