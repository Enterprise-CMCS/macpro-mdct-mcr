import { getAddEditDrawerText, getFormattedEntityData } from "./entities";
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

    test("Returns just a heading when no exception or non-compliance status given", () => {
      const entityData = getFormattedEntityData(EntityType.PLANS, mockPlanData);

      const expectedData = {
        heading: `Problem displaying data for ${mockPlanData.name}`,
      };

      expect(entityData).toEqual(expectedData);
    });

    test("Returns empty array when no entity provided", () => {
      const entityData = getFormattedEntityData(EntityType.PLANS, undefined);
      expect(entityData).toEqual({});
    });
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
