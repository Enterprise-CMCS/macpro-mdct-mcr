import { getFormattedEntityData } from "./entities";
import { ModalDrawerEntityTypes } from "types";
import {
  mockAccessMeasuresEntity,
  mockCompletedAccessMeasuresFormattedEntityData,
  mockSanctionsEntity,
  mockCompletedSanctionsFormattedEntityData,
  mockQualityMeasuresEntity,
  mockQualityMeasuresFormattedEntityData,
  mockHalfCompletedQualityMeasuresEntity,
  mockHalfCompletedQualityMeasuresFormattedEntityData,
  mockCompletedQualityMeasuresEntity,
  mockCompletedQualityMeasuresFormattedEntityData,
} from "utils/testing/setupJest";

const mockReportFieldData = {
  plans: [
    {
      id: "mock-plan-id-1",
      name: "mock-plan-name-1",
    },
    {
      id: "mock-plan-id-2",
      name: "mock-plan-name-2",
    },
  ],
};

describe("Test getFormattedEntityData", () => {
  it("Test getFormattedEntityData returns correct data for access measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.ACCESS_MEASURES,
      mockAccessMeasuresEntity
    );
    expect(entityData).toEqual(mockCompletedAccessMeasuresFormattedEntityData);
  });

  it("Returns correct data for quality measures with no completed measures", () => {
    const result = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(result).toEqual(mockQualityMeasuresFormattedEntityData);
  });

  it("Returns correct data for quality measures with some completed measures", () => {
    const result = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockHalfCompletedQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(result).toEqual(mockHalfCompletedQualityMeasuresFormattedEntityData);
  });

  it("Returns correct data for quality measures with fully completed measures", () => {
    const result = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockCompletedQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(result).toEqual(mockCompletedQualityMeasuresFormattedEntityData);
  });

  it("Test getFormattedEntityData returns correct data for sanctions", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.SANCTIONS,
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockCompletedSanctionsFormattedEntityData);
  });
});
