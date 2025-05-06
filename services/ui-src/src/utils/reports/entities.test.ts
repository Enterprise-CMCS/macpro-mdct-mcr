import { getAddEditDrawerText, getFormattedEntityData } from "./entities";
// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { EntityType } from "types";
// utils
import {
  mockAccessMeasuresEntity,
  mockCompletedAccessMeasuresFormattedEntityData,
  mockSanctionsEntity,
  mockCompletedSanctionsFormattedEntityData,
  mockQualityMeasuresEntity,
  mockUnfinishedQualityMeasuresFormattedEntityData,
  mockCompletedQualityMeasuresEntity,
  mockCompletedQualityMeasuresFormattedEntityData,
  mockReportFieldData,
  mockQualityMeasuresEntityMissingDetails,
  mockQualityMeasuresFormattedEntityDataMissingDetails,
  mockModalDrawerReportPageVerbiage,
} from "utils/testing/setupJest";

describe("getFormattedEntityData()", () => {
  describe("entity type: access measures", () => {
    test("Returns correct data for access measures", () => {
      const entityData = getFormattedEntityData(
        EntityType.ACCESS_MEASURES,
        mockAccessMeasuresEntity
      );
      expect(entityData).toEqual(
        mockCompletedAccessMeasuresFormattedEntityData
      );
    });

    test("returns 'Add' when no conditions are met", () => {
      const result = getAddEditDrawerText(
        EntityType.ACCESS_MEASURES,
        { provider: false },
        mockModalDrawerReportPageVerbiage
      );
      expect(result).toBe("Add Mock drawer title");
    });

    test("returns 'Edit' when provider exists for ACCESS_MEASURES", () => {
      const result = getAddEditDrawerText(
        EntityType.ACCESS_MEASURES,
        { provider: true },
        mockModalDrawerReportPageVerbiage
      );
      expect(result).toBe("Edit Mock drawer title");
    });
  });

  describe("entity type: quality measures", () => {
    test("Returns correct data for quality measures with no completed measures", () => {
      const entityData = getFormattedEntityData(
        EntityType.QUALITY_MEASURES,
        mockQualityMeasuresEntity,
        mockReportFieldData
      );
      expect(entityData).toEqual(
        mockUnfinishedQualityMeasuresFormattedEntityData
      );
    });

    test("Returns correct data for quality measures with some completed measures", () => {
      const entityData = getFormattedEntityData(
        EntityType.QUALITY_MEASURES,
        mockQualityMeasuresEntityMissingDetails,
        mockReportFieldData
      );
      expect(entityData).toEqual(
        mockQualityMeasuresFormattedEntityDataMissingDetails
      );
    });

    test("Returns correct data for quality measures with fully completed measures", () => {
      const entityData = getFormattedEntityData(
        EntityType.QUALITY_MEASURES,
        mockCompletedQualityMeasuresEntity,
        mockReportFieldData
      );
      expect(entityData).toEqual(
        mockCompletedQualityMeasuresFormattedEntityData
      );
    });

    test("returns 'Edit' when perPlanResponses exists for QUALITY_MEASURES", () => {
      const result = getAddEditDrawerText(
        EntityType.QUALITY_MEASURES,
        { perPlanResponses: [{ name: "plan 1", response: "n/a" }] },
        mockModalDrawerReportPageVerbiage
      );
      expect(result).toBe("Edit Mock drawer title");
    });
  });

  describe("entity type: sanctions", () => {
    test("Returns correct data for sanctions", () => {
      const entityData = getFormattedEntityData(
        EntityType.SANCTIONS,
        mockSanctionsEntity,
        mockReportFieldData
      );
      expect(entityData).toEqual(mockCompletedSanctionsFormattedEntityData);
    });

    test("returns 'Edit' when assessmentDate exists for SANCTIONS", () => {
      const result = getAddEditDrawerText(
        EntityType.SANCTIONS,
        { assessmentDate: true },
        mockModalDrawerReportPageVerbiage
      );
      expect(result).toBe("Edit Mock drawer title");
    });
  });

  describe("entity type: plans", () => {
    const mockPlanData = {
      id: "mock id",
      name: "mock plan name",
    };

    test("Returns correct data for non-compliant plans", () => {
      const mockNonCompliantPlan = {
        ...mockPlanData,
        exceptionsNonCompliance: nonComplianceStatus,
        "mock-nonComplianceDescription": "mock description",
        "mock-nonComplianceAnalyses": [
          {
            id: "id-1",
            value: "mock analysis method 1",
          },
          {
            id: "id-2",
            value: "mock analysis method 2",
          },
        ],
        "mock-nonCompliancePlanToAchieveCompliance":
          "mock plan to achieve compliance",
        "mock-nonComplianceMonitoringProgress": "mock monitoring progress",
        "mock-nonComplianceReassessmentDate": "mock reassessment date",
      };

      const entityData = getFormattedEntityData(
        EntityType.PLANS,
        mockNonCompliantPlan
      );

      const expectedData = {
        heading: `Plan deficiencies for ${mockNonCompliantPlan.name}: 42 C.F.R. § 438.68`,
        questions: [
          {
            question: "Description",
            answer: "mock description",
          },
          {
            question: "Analyses used to identify deficiencies",
            answer: "mock analysis method 1, mock analysis method 2",
          },
          {
            question: "What the plan will do to achieve compliance",
            answer: "mock plan to achieve compliance",
          },
          {
            question: "Monitoring progress",
            answer: "mock monitoring progress",
          },
          {
            question: "Reassessment date",
            answer: "mock reassessment date",
          },
        ],
      };

      expect(entityData).toEqual(expectedData);
    });

    test("Returns correct data for exception plans", () => {
      const mockExceptionPlan = {
        ...mockPlanData,
        exceptionsNonCompliance: exceptionsStatus,
        "mock-exceptionsDescription": "mock description",
        "mock-exceptionsJustification": "mock justification",
      };

      const entityData = getFormattedEntityData(
        EntityType.PLANS,
        mockExceptionPlan
      );

      const expectedData = {
        heading: `Exceptions granted for ${mockExceptionPlan.name} under 42 C.F.R. § 438.68(d)`,
        questions: [
          {
            question:
              "Describe any network adequacy standard exceptions that the state has granted to the plan under 42 C.F.R. § 438.68(d).",
            answer: "mock description",
          },
          {
            question:
              "Justification for exceptions granted under 42 C.F.R. § 438.68(d)",
            answer: "mock justification",
          },
        ],
      };

      expect(entityData).toEqual(expectedData);
    });

    test("Returns just a heading when no exception or non-compliance status given", () => {
      const entityData = getFormattedEntityData(EntityType.PLANS, mockPlanData);

      const expectedData = {
        heading: `Problem displaying data for ${mockPlanData.name}`,
      };

      expect(entityData).toEqual(expectedData);
    });
  });

  test("Returns empty array when no entity provided", () => {
    const entityData = getFormattedEntityData(
      EntityType.PLANS, // could be any type
      undefined
    );
    expect(entityData).toEqual({});
  });

  test("Returns empty object if invalid entity type is passed", () => {
    const entityData = getFormattedEntityData(
      "invalid entity type" as EntityType,
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual({});
  });
});
