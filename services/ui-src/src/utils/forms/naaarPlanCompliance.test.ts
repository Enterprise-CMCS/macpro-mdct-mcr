// constants
import {
  exceptionsStatus,
  nonComplianceStatus,
  nonCompliantLabels,
  planComplianceStandardKey,
} from "../../constants";
// types
import {
  Choice,
  EntityShape,
  FormField,
  FormJson,
  NaaarStandardsTableShape,
} from "types";
// utils
import {
  addAnalysisMethods,
  addExceptionsNonComplianceStatus,
  addStandardId,
  exceptionsNonComplianceStatus,
  getExceptionsNonComplianceCounts,
  getExceptionsNonComplianceKeys,
  hasComplianceDetails,
  isComplianceFormComplete,
  isPlanComplete,
} from "utils";

describe("utils/forms/naaarPlanCompliance", () => {
  describe("hasComplianceDetails()", () => {
    const exceptionsNonCompliance = [
      "mockPrefix-mockEntityId1-nonComplianceDescription",
    ];
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

    test("adds id to key in nested objects", () => {
      const formJson = {
        id: "mockPrefix-something",
        fields: [{ id: "mockPrefix-something", type: "mock" }],
        options: { test: 0 },
      } as FormJson;

      const newFormJson = {
        id: "mockPrefix-mockId-something",
        fields: [{ id: "mockPrefix-mockId-something", type: "mock" }],
        options: { test: 0 },
      } as FormJson;

      expect(addStandardId(formJson, standardPrefix, standardId)).toEqual(
        newFormJson
      );
    });
  });

  describe("exceptionsNonComplianceStatus()", () => {
    const exceptions = ["mockPrefix-mockEntityId1-exceptionsDescription"];
    const standardPrefix = "mockPrefix";

    test("returns exceptionsStatus", () => {
      expect(
        exceptionsNonComplianceStatus(
          exceptions,
          standardPrefix,
          "mockEntityId1"
        )
      ).toBe(exceptionsStatus);
    });

    test("returns nonComplianceStatus", () => {
      const nonCompliance = [
        "mockPrefix-mockEntityId2-nonComplianceDescription",
      ];
      expect(
        exceptionsNonComplianceStatus(
          nonCompliance,
          standardPrefix,
          "mockEntityId2"
        )
      ).toBe(nonComplianceStatus);
    });

    test("returns undefined", () => {
      expect(
        exceptionsNonComplianceStatus(
          exceptions,
          standardPrefix,
          "mockEntityId2"
        )
      ).toBeUndefined();
    });
  });

  describe("addExceptionsNonComplianceStatus()", () => {
    const entities = [
      {
        entity: {
          id: "mockEntityId1",
          "mockPrefix-mockEntityId1-nonComplianceDescription": "Mock Value",
        },
      },
      {
        entity: {
          id: "mockEntityId2",
          "mockPrefix-mockEntityId2-exceptionsDescription": "Mock Value",
        },
      },
      { entity: { id: "mockEntityId3" } },
    ] as NaaarStandardsTableShape[];

    const exceptionsNonCompliance = [
      "mockPrefix-mockEntityId1-nonComplianceDescription",
      "mockPrefix-mockEntityId2-exceptionsDescription",
    ];

    const standardPrefix = "mockPrefix";

    const expectedEntities = [
      {
        entity: {
          id: "mockEntityId1",
          "mockPrefix-mockEntityId1-nonComplianceDescription": "Mock Value",
        },
        exceptionsNonCompliance: nonComplianceStatus,
      },
      {
        entity: {
          id: "mockEntityId2",
          "mockPrefix-mockEntityId2-exceptionsDescription": "Mock Value",
        },
        exceptionsNonCompliance: exceptionsStatus,
      },
      { entity: { id: "mockEntityId3" } },
    ];

    test("adds exceptionsNonCompliance to data objects", () => {
      expect(
        addExceptionsNonComplianceStatus(
          entities,
          exceptionsNonCompliance,
          standardPrefix
        )
      ).toEqual(expectedEntities);
    });
  });

  describe("addAnalysisMethods", () => {
    const standardKeyPrefix = "planCompliance43868";
    const entityId = "standard-id";
    const analysisMethodsFieldId =
      "standard_analysisMethodsUtilized-mockStandardTypeId";
    const nonComplianceAnalysesId = `${standardKeyPrefix}-${entityId}-nonComplianceAnalyses`;
    const applicablePlansPrefix = "analysis_method_applicable_plans-";
    const plan1Id = "mock-plan-id-1";
    const plan2Id = "mock-plan-id-2";

    const mockForm = () => ({
      id: "mockId",
      fields: [
        {
          id: nonComplianceAnalysesId,
          type: "checkbox",
          validation: {
            type: "checkbox",
            nested: true,
            parentFieldName: "planCompliance43868_standard",
            parentOptionId: "mockParentOptionId",
          },
          props: {
            hint: "Indicate which analyses reflect the deficiencies.",
            choices: [
              {
                label: "Geomapping",
                children: [],
              },
            ],
          },
        },
      ],
    });

    // Applied to plan 1, with a stale display value (the plan has since been renamed)
    const geomapping = {
      id: "mockUUID1",
      name: "Geomapping",
      analysis_method_applicable_plans: [
        { key: `${applicablePlansPrefix}${plan1Id}`, value: "Stale Plan Name" },
      ],
    };

    // Applied to plan 2 only
    const otherMethod = {
      id: "mockUUID2",
      name: "MockItem2",
      analysis_method_applicable_plans: [
        { key: `${applicablePlansPrefix}${plan2Id}`, value: "Plan 2" },
      ],
    };

    const selectedStandard = {
      id: entityId,
      [analysisMethodsFieldId]: [
        {
          key: `${analysisMethodsFieldId}-mockUUID1`,
          value: "Geomapping",
        },
      ],
    };

    const geomappingChoice = {
      id: `${nonComplianceAnalysesId}_mockUUID1`,
      label: "Geomapping",
      children: expect.any(Array),
    };

    test("should inject associated analysis methods into the correct form field", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [geomapping, otherMethod],
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([geomappingChoice]);
    });

    test("should match applicable plans by id even when the stored plan name is stale", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [
          {
            ...geomapping,
            analysis_method_applicable_plans: [
              {
                key: `${applicablePlansPrefix}${plan1Id}`,
                value: "A Name No Plan Has",
              },
            ],
          },
        ],
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([geomappingChoice]);
    });

    test("should match plan ids containing dashes", () => {
      const dashedPlanId = "6235f12-4b1a-4c3d-9e8f-38a36a8d7e8c";
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [
          {
            ...geomapping,
            analysis_method_applicable_plans: [
              {
                key: `${applicablePlansPrefix}${dashedPlanId}`,
                value: "Stale Plan Name",
              },
            ],
          },
        ],
        dashedPlanId
      );

      expect(result.fields[0]?.props?.choices).toEqual([geomappingChoice]);
    });

    test("should use the custom analysis method name when present", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [{ ...geomapping, custom_analysis_method_name: "Mock Custom Method" }],
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([
        {
          id: `${nonComplianceAnalysesId}_mockUUID1`,
          label: "Mock Custom Method",
        },
      ]);
    });

    test("should exclude methods applied to a different plan", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        {
          id: entityId,
          [analysisMethodsFieldId]: [
            { key: `${analysisMethodsFieldId}-mockUUID1`, value: "Geomapping" },
            { key: `${analysisMethodsFieldId}-mockUUID2`, value: "MockItem2" },
          ],
        },
        [geomapping, otherMethod],
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([geomappingChoice]);
    });

    test("should make the field optional and explain when no methods apply", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [otherMethod],
        plan1Id
      );

      const field = result.fields[0] as FormField;
      expect(field?.props?.choices).toEqual([]);
      expect(field?.validation).toBe("checkboxOptional");
      expect(field?.props?.hint).toContain(
        "No analysis methods apply to both this plan and this standard."
      );
    });

    test("should return no choices when no plan is selected", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [geomapping, otherMethod],
        undefined
      );

      expect(result.fields[0]?.props?.choices).toEqual([]);
      expect((result.fields[0] as FormField)?.validation).toBe(
        "checkboxOptional"
      );
    });

    test("should ignore methods without usable applicable plan data", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        [
          { id: "mockUUID1", name: "Geomapping" },
          {
            id: "mockUUID1",
            name: "Geomapping",
            // intentionally malformed (no `key`) to exercise the runtime guard
            analysis_method_applicable_plans: [
              { value: "Stale Plan Name" },
            ] as Choice[],
          },
        ],
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([]);
    });

    test("should return no choices when there are no analysis methods", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        selectedStandard,
        undefined,
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([]);
    });

    test("should return no choices when the standard utilizes no analysis methods", () => {
      const result = addAnalysisMethods(
        mockForm(),
        standardKeyPrefix,
        { id: entityId },
        [geomapping],
        plan1Id
      );

      expect(result.fields[0]?.props?.choices).toEqual([]);
    });
  });

  describe("getExceptionsNonComplianceKeys()", () => {
    const keyPrefix = planComplianceStandardKey;
    const expectedKey = `${keyPrefix}-mock`;
    const entity: EntityShape = {
      id: "mockEntityId1",
      [expectedKey]: "Mock Value",
      "mock-nonmatching-key": "mock value",
    };

    const exceptionsNonCompliance = [expectedKey];

    test("returns array of keys matching plan compliance constant", () => {
      expect(getExceptionsNonComplianceKeys(entity)).toEqual(
        exceptionsNonCompliance
      );
    });
  });

  describe("getExceptionsNonComplianceCounts()", () => {
    const mockExceptionComplianceKeys = [
      "mock-key-1",
      "mock-exceptionsDescription",
      "mock-nonComplianceDescription",
    ];

    test("returns counts of zero for empty array", () => {
      expect(getExceptionsNonComplianceCounts([])).toEqual({
        exceptionsCount: 0,
        nonComplianceCount: 0,
      });
    });

    test("returns counts of 1 for exception key and 1 for no non-compliance key", () => {
      expect(
        getExceptionsNonComplianceCounts(mockExceptionComplianceKeys)
      ).toEqual({ exceptionsCount: 1, nonComplianceCount: 1 });
    });
  });

  describe("isComplianceFormComplete()", () => {
    test("returns false by default", () => {
      const entity = { id: "mockEntityId" };
      const formId = "mockFormId";

      expect(isComplianceFormComplete(entity, formId)).toBe(false);
    });

    describe("plan compliance 438.68", () => {
      const formId = "planCompliance43868";
      test("returns true if planCompliance43868 is complete with Yes", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [{ id: "mockYes", value: "Mock Yes" }],
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns true if planCompliance43868 is complete with exceptions", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [
            { id: "mockNo", value: nonCompliantLabels["438.68"] },
          ],
          [`${formId}_standard-exceptionsDescription`]: "Mock Value",
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns true if planCompliance43868 is complete with non-compliance", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [
            { id: "mockNo", value: nonCompliantLabels["438.68"] },
          ],
          [`${formId}_standard-nonComplianceDescription`]: "Mock Value",
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns false if planCompliance43868 is not complete", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [
            { id: "mockNo", value: nonCompliantLabels["438.68"] },
          ],
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(false);
      });
    });

    describe("plan compliance 438.206", () => {
      const formId = "planCompliance438206";

      test("returns true if planCompliance438206 is complete with Yes", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [{ id: "mockYes", value: "Mock Yes" }],
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns true if planCompliance438206 is complete with non-compliance", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [
            { id: "mockNo", value: nonCompliantLabels["438.206"] },
          ],
          [`${formId}_description`]: "Mock Value",
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns false if planCompliance438206 is not complete", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [
            { id: "mockNo", value: nonCompliantLabels["438.206"] },
          ],
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(false);
      });
    });
  });

  describe("isPlanComplete()", () => {
    test("returns true if plan compliance is complete", () => {
      const entity = {
        id: "mockEntityId",
        planCompliance43868_assurance: [{ id: "mockYes", value: "Mock Yes" }],
        planCompliance438206_assurance: [{ id: "mockYes", value: "Mock Yes" }],
      };
      expect(isPlanComplete(entity)).toBe(true);
    });

    test("returns false if planCompliance43868 is not complete", () => {
      const entity = {
        id: "mockEntityId",
        planCompliance43868_assurance: [
          { id: "mockNo", value: nonCompliantLabels["438.68"] },
        ],
        planCompliance438206_assurance: [{ id: "mockYes", value: "Mock Yes" }],
      };
      expect(isPlanComplete(entity)).toBe(false);
    });

    test("returns false if planCompliance438206 is not complete", () => {
      const entity = {
        id: "mockEntityId",
        planCompliance43868_assurance: [{ id: "mockYes", value: "Mock Yes" }],
        planCompliance438206_assurance: [
          { id: "mockNo", value: nonCompliantLabels["438.206"] },
        ],
      };
      expect(isPlanComplete(entity)).toBe(false);
    });
  });
});
