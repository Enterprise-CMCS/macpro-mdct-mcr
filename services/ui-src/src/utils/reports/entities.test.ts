import { getAddEditDrawerText, getFormattedEntityData } from "./entities";
import { EntityType } from "types";
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

describe("Test getFormattedEntityData", () => {
  it("Returns correct data for access measures", () => {
    const entityData = getFormattedEntityData(
      EntityType.ACCESS_MEASURES,
      mockAccessMeasuresEntity
    );
    expect(entityData).toEqual(mockCompletedAccessMeasuresFormattedEntityData);
  });

  it("Returns correct data for quality measures with no completed measures", () => {
    const entityData = getFormattedEntityData(
      EntityType.QUALITY_MEASURES,
      mockQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(
      mockUnfinishedQualityMeasuresFormattedEntityData
    );
  });

  it("Returns correct data for quality measures with some completed measures", () => {
    const entityData = getFormattedEntityData(
      EntityType.QUALITY_MEASURES,
      mockQualityMeasuresEntityMissingDetails,
      mockReportFieldData
    );
    expect(entityData).toEqual(
      mockQualityMeasuresFormattedEntityDataMissingDetails
    );
  });

  it("Returns correct data for quality measures with fully completed measures", () => {
    const entityData = getFormattedEntityData(
      EntityType.QUALITY_MEASURES,
      mockCompletedQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockCompletedQualityMeasuresFormattedEntityData);
  });

  it("Returns correct data for sanctions", () => {
    const entityData = getFormattedEntityData(
      EntityType.SANCTIONS,
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockCompletedSanctionsFormattedEntityData);
  });

  it("Returns empty object if invalid entity type is passed", () => {
    const entityData = getFormattedEntityData(
      "invalid entity type" as EntityType,
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual({});
  });
});

describe("Test getFormattedEntityData", () => {
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

  test("returns 'Edit' when perPlanResponses exists for QUALITY_MEASURES", () => {
    const result = getAddEditDrawerText(
      EntityType.QUALITY_MEASURES,
      { perPlanResponses: [{ name: "plan 1", response: "n/a" }] },
      mockModalDrawerReportPageVerbiage
    );
    expect(result).toBe("Edit Mock drawer title");
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
