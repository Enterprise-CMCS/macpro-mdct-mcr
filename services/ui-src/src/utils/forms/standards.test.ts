import {
  filterStandardsAfterPlanDeletion,
  filterStandardsByUtilizedAnalysisMethods,
} from "./standards";

describe("filterNaaarStandards", () => {
  describe("filterStandardsByUtilizedAnalysisMethods", () => {
    const standardId = "mockStandardUUID";
    const analysisMethodIdToRemove = "mockAnalysisMethodUUID";
    const utilizedKey = `standard_analysisMethodsUtilized-${standardId}`;

    const standards = [
      {
        id: "standard-1",
        [utilizedKey]: [
          {
            key: `${utilizedKey}-${analysisMethodIdToRemove}`,
            value: "Geomapping",
          },
          {
            key: `${utilizedKey}-someOtherMethod`,
            value: "Survey",
          },
        ],
      },
      {
        id: "standard-2",
        [utilizedKey]: [
          {
            key: `${utilizedKey}-${analysisMethodIdToRemove}`,
            value: "Geomapping",
          },
        ],
      },
      {
        id: "standard-3",
        [utilizedKey]: [],
      },
    ];

    test("removes the specified analysis method from all standards", () => {
      const result = filterStandardsByUtilizedAnalysisMethods(
        standards,
        analysisMethodIdToRemove
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("standard-1");

      const remainingMethodKeys = result[0][utilizedKey].map(
        (method: { key: any }) => method.key
      );
      expect(remainingMethodKeys).toEqual([`${utilizedKey}-someOtherMethod`]);
    });

    test("removes entire standard if all methods are removed", () => {
      const singleMethodStandard = [
        {
          id: "only-one-method",
          [utilizedKey]: [
            {
              key: `${utilizedKey}-${analysisMethodIdToRemove}`,
              value: "Geomapping",
            },
          ],
        },
      ];

      const result = filterStandardsByUtilizedAnalysisMethods(
        singleMethodStandard,
        analysisMethodIdToRemove
      );
      expect(result).toHaveLength(0);
    });

    test("keeps standards without utilized keys unchanged", () => {
      const noUtilizedKeys = [
        {
          id: "no-utilized-key",
          unrelatedProperty: true,
        },
      ];

      const result = filterStandardsByUtilizedAnalysisMethods(
        noUtilizedKeys,
        analysisMethodIdToRemove
      );
      expect(result).toHaveLength(0);
    });
  });

  describe("filterStandardsAfterPlanDeletion", () => {
    const standardId1 = "mockStandardUUID1";
    const standardId2 = "mockStandardUUID2";

    const utilizedKey1 = `standard_analysisMethodsUtilized-${standardId1}`;
    const utilizedKey2 = `standard_analysisMethodsUtilized-${standardId2}`;

    const methodStillUsed = {
      id: "mockAnalysisMethodUUID1",
      name: "Geomapping",
      analysis_applicable: [{ key: "analysis_applicable-xyz", value: "Yes" }],
      analysis_method_applicable_plans: [
        { key: "analysis_method_applicable_plans-mockUUID", value: "1" },
      ],
    };

    const methodUnused = {
      id: "mockAnalysisMethodUUID2",
      name: "Electronic Visit Verification Data Analysis",
      analysis_applicable: [{ key: "analysis_applicable", value: "Yes" }],
      analysis_method_applicable_plans: [],
    };

    const customMethod = {
      id: "mockCustomMethodUUID",
      custom_analysis_method_name: "Custom Insight",
      analysis_method_applicable_plans: [
        { key: "analysis_method_applicable_plans-mockUUID", value: "1" },
      ],
    };

    const standards = [
      {
        id: "standard-1",
        [utilizedKey1]: [
          {
            key: `${utilizedKey1}-mockAnalysisMethodUUID1`,
            value: "Geomapping",
          },
        ],
      },
      {
        id: "standard-2",
        [utilizedKey2]: [
          {
            key: `${utilizedKey2}-mockAnalysisMethodUUID2`,
            value: "Electronic Visit Verification Data Analysis",
          },
        ],
      },
      {
        id: "standard-3",
        [utilizedKey2]: [
          {
            key: `${utilizedKey2}-mockCustomMethodUUID`,
            value: "Custom Method",
          },
        ],
      },
      {
        id: "standard-4",
        [utilizedKey2]: [],
      },
    ];

    test("keeps standards with still-utilized analysis methods", () => {
      const result = filterStandardsAfterPlanDeletion(
        standards,
        [methodStillUsed],
        ["mockUUID"]
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("standard-1");
    });

    test("removes analysis methods that are no longer applicable", () => {
      const result = filterStandardsAfterPlanDeletion(
        standards,
        [methodUnused],
        ["mockUUID"]
      );
      expect(result).toHaveLength(0);
    });

    test("filters out standards with no applicable methods remaining", () => {
      const result = filterStandardsAfterPlanDeletion(
        standards,
        [methodStillUsed, methodUnused],
        ["mockUUID"]
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("standard-1");
      expect(result[0][utilizedKey2]).toBeUndefined();
    });

    test("keeps standards tied to custom analysis methods", () => {
      const result = filterStandardsAfterPlanDeletion(
        standards,
        [customMethod],
        ["mockUUID"]
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("standard-3");
      expect(result[0][utilizedKey2][0].key).toContain("mockCustomMethodUUID");
    });
    test("removes standards if custom method is no longer tied to any plan", () => {
      const customMethodNoPlans = {
        ...customMethod,
        analysis_method_applicable_plans: [],
      };
      const result = filterStandardsAfterPlanDeletion(
        standards,
        [customMethodNoPlans],
        ["mockUUID"]
      );
      expect(result).toHaveLength(0);
    });

    test("handles empty analysisMethods list by removing all standards", () => {
      const result = filterStandardsAfterPlanDeletion(
        standards,
        [],
        ["mockUUID"]
      );
      expect(result).toHaveLength(0);
    });
  });
});
