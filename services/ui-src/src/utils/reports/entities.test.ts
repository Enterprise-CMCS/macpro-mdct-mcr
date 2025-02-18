import { getFormattedEntityData } from "./entities";
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
