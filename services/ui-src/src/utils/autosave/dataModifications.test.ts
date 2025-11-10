import {
  handlePriorAuthorization,
  updatePlanNames,
  updatePlansInAnalysisMethods,
  updatePlansInExemptions,
} from "./dataModifications";
// types
import { FieldDataTuple } from "./autosave";

describe("utils/autosave/dataModifications", () => {
  describe("handlePriorAuthorization()", () => {
    it("allows prior authorization fields", () => {
      const dataToWrite = {
        id: "mock-id",
        fieldData: {
          plans: [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
            },
          ],
        },
      };
      const reportFieldData = {
        plans: [
          {
            id: "mock-plan-1",
            name: "Mock Plan 1",
          },
        ],
      };
      const fieldsToSave = [
        [
          "reportingDataPriorToJune2026",
          [
            {
              key: "mock-choice-yes",
              value: "Yes",
            },
          ],
        ] as FieldDataTuple,
      ];
      const input = handlePriorAuthorization(
        dataToWrite,
        reportFieldData,
        fieldsToSave
      );
      const expectedResult = {
        id: "mock-id",
        fieldData: {
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

    it("removes prior authorization fields", () => {
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
      const fieldsToSave = [
        [
          "reportingDataPriorToJune2026",
          [
            {
              key: "mock-choice-yes",
              value: "No",
            },
          ],
        ] as FieldDataTuple,
      ];
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
              key: "mock-choice-yes",
              value: "No",
            },
          ],
        },
      };

      expect(input).toEqual(expectedResult);
    });
  });

  describe("updatePlansInAnalysisMethods()", () => {
    it("updates plans in analysis_method_applicable_plans", () => {
      const dataToWrite = {
        fieldData: {
          plans: [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
            },
          ],
        },
      };

      const reportFieldData = {
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
      };

      const input = updatePlansInAnalysisMethods(dataToWrite, reportFieldData);

      const expectedResult = {
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
      };

      expect(input).toEqual(expectedResult);
    });
  });

  describe("updatePlansInExemptions()", () => {
    it("updates plans in plansExemptFromQualityMeasures", () => {
      const dataToWrite = {
        fieldData: {
          plans: [
            {
              id: "mock-plan-1",
              name: "Mock Plan 1",
            },
          ],
        },
      };
      const reportFieldData = {
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
      };
      const input = updatePlansInExemptions(dataToWrite, reportFieldData);
      const expectedResult = {
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
      };

      expect(input).toEqual(expectedResult);
    });
  });

  describe("updatePlanNames()", () => {
    it("updates plan names", () => {
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
});
