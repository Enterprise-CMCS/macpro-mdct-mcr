// types
import { EntityShape, FormJson } from "types";
// utils
import { addStandardId, filteredStandards, hasComplianceDetails } from "utils";

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

describe("utils/forms/naaarPlanCompliance", () => {
  describe("hasComplianceDetails()", () => {
    const exceptionsNonCompliance = ["mockPrefix-mockEntityId1-otherText"];
    const standardPrefix = "mockPrefix";

    test("returns true", () => {
      expect(
        hasComplianceDetails(
          exceptionsNonCompliance,
          standardPrefix,
          "mockEntityId1"
        )
      ).toBe(true);
    });

    test("returns false", () => {
      expect(
        hasComplianceDetails(
          exceptionsNonCompliance,
          standardPrefix,
          "mockEntityId2"
        )
      ).toBe(false);
    });
  });

  describe("filteredStandards()", () => {
    test("returns standards used by plan", () => {
      const plan = { id: "mockPlan1", value: "Mock Plan 1" } as EntityShape;

      const analysisMethods = [
        {
          id: "mockAnalysisMethod1",
          name: "Mock Analysis 1",
          analysis_method_applicable_plans: [
            {
              key: "analysis_method_applicable_plans-mockPlan1",
              value: "Mock Plan 1",
            },
          ],
        },
        {
          id: "mockAnalysisMethod2",
          name: "Mock Analysis 2",
          analysis_method_applicable_plans: [
            {
              key: "analysis_method_applicable_plans-mockPlan2",
              value: "Mock Plan 2",
            },
          ],
        },
      ] as EntityShape[];

      const standards = [
        {
          id: "mockStandard1",
          "standard_analysisMethodsUtilized-mockStandardTypeId1": [
            {
              key: "standard_analysisMethodsUtilized-mockStandardTypeId1-mockAnalysisMethod1",
              value: "Mock Analysis 1",
            },
          ],
        },
        {
          id: "mockStandard2",
          "standard_analysisMethodsUtilized-mockStandardTypeId2": [
            {
              key: "standard_analysisMethodsUtilized-mockStandardTypeId2-mockAnalysisMethod2",
              value: "Mock Analysis 2",
            },
          ],
        },
      ] as EntityShape[];

      const standardsUsedByPlan = [
        {
          id: "mockStandard1",
          "standard_analysisMethodsUtilized-mockStandardTypeId1": [
            {
              key: "standard_analysisMethodsUtilized-mockStandardTypeId1-mockAnalysisMethod1",
              value: "Mock Analysis 1",
            },
          ],
        },
      ] as EntityShape[];

      expect(filteredStandards(analysisMethods, standards, plan)).toEqual(
        standardsUsedByPlan
      );
    });
  });

  describe("addStandardId()", () => {
    const standardPrefix = "mockPrefix";
    const standardId = "mockId";

    test("adds id to key", () => {
      const formJson = { id: "mockPrefix" } as FormJson;
      const newFormJson = { id: "mockPrefix-mockId" } as FormJson;

      expect(addStandardId(formJson, standardPrefix, standardId)).toEqual(
        newFormJson
      );
    });

    test("adds id to key with existing dash", () => {
      const formJson = { id: "mockPrefix-something" } as FormJson;
      const newFormJson = { id: "mockPrefix-mockId-something" } as FormJson;

      expect(addStandardId(formJson, standardPrefix, standardId)).toEqual(
        newFormJson
      );
    });
  });
});
