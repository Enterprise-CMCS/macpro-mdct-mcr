// constants
import {
  exceptionsStatus,
  nonComplianceStatus,
  nonCompliantLabel,
  planComplianceStandardKey,
} from "../../constants";
// types
import { EntityShape, FormJson, NaaarStandardsTableShape } from "types";
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
    test("should inject associated analysis methods into the correct form field", () => {
      const mockForm = {
        id: "mockId",
        fields: [
          {
            id: "planCompliance43868-standard-id-nonComplianceAnalyses",
            type: "checkbox",
            props: {},
          },
        ],
      };

      const standardKeyPrefix = "planCompliance43868";
      const entityId = "standard-id";
      const selectedEntityName = "Plan 1";

      const createdAnalysisMethods = [
        {
          id: "mockUUID1",
          name: "Geomapping",
          analysis_method_applicable_plans: [{ value: "Plan 1" }],
        },
        {
          id: "mockUUID2",
          name: "MockItem2",
          analysis_method_applicable_plans: [{ value: "Plan 2" }],
        },
        {
          id: "mockUUID3",
          name: "Plan Provider Directory Review",
          analysis_method_applicable_plans: [{ value: "Plan 1" }],
        },
        {
          id: "mockUUID4",
          name: "Secret Shopper: Appointment Availability",
          analysis_method_applicable_plans: [{ value: "Plan 1" }],
        },
      ];

      const analysisMethodsInStandards = [
        {
          id: "standard-id",
          [`standard_analysisMethodsUtilized-${entityId}-mockUUID1`]: [
            {
              key: `standard_analysisMethodsUtilized-${entityId}-mockUUID1`,
              value: "Geomapping",
            },
            {
              key: `standard_analysisMethodsUtilized-${entityId}-mockUUID3`,
              value: "Plan Provider Directory Review",
            },
            {
              key: `standard_analysisMethodsUtilized-${entityId}-mockUUID4`,
              value: "Secret Shopper: Appointment Availability",
            },
          ],
        },
      ];

      const result = addAnalysisMethods(
        mockForm,
        standardKeyPrefix,
        entityId,
        analysisMethodsInStandards,
        createdAnalysisMethods,
        selectedEntityName
      );

      expect(result.fields[0]?.props?.choices).toEqual([
        {
          id: "planCompliance43868-standard-id-nonComplianceAnalyses_mockUUID1",
          label: "Geomapping",
          children: expect.any(Array),
        },
        {
          id: "planCompliance43868-standard-id-nonComplianceAnalyses_mockUUID3",
          label: "Plan Provider Directory Review",
          children: expect.any(Array),
        },
        {
          id: "planCompliance43868-standard-id-nonComplianceAnalyses_mockUUID4",
          label: "Secret Shopper: Appointment Availability",
          children: expect.any(Array),
        },
      ]);
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
          [`${formId}_assurance`]: [{ id: "mockNo", value: nonCompliantLabel }],
          [`${formId}_standard-exceptionsDescription`]: "Mock Value",
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns true if planCompliance43868 is complete with non-compliance", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [{ id: "mockNo", value: nonCompliantLabel }],
          [`${formId}_standard-nonComplianceDescription`]: "Mock Value",
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns false if planCompliance43868 is not complete", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [{ id: "mockNo", value: nonCompliantLabel }],
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
          [`${formId}_assurance`]: [{ id: "mockNo", value: nonCompliantLabel }],
          [`${formId}_description`]: "Mock Value",
        };

        expect(isComplianceFormComplete(entity, formId)).toBe(true);
      });

      test("returns false if planCompliance438206 is not complete", () => {
        const entity = {
          id: "mockEntityId",
          [`${formId}_assurance`]: [{ id: "mockNo", value: nonCompliantLabel }],
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
          { id: "mockNo", value: nonCompliantLabel },
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
          { id: "mockNo", value: nonCompliantLabel },
        ],
      };
      expect(isPlanComplete(entity)).toBe(false);
    });
  });
});
