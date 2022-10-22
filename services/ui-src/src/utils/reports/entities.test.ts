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
  it("Returns correct data for access measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.ACCESS_MEASURES,
      mockAccessMeasuresEntity
    );
    expect(entityData).toEqual(mockCompletedAccessMeasuresFormattedEntityData);
  });

  it("Returns correct data for quality measures with no completed measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockQualityMeasuresFormattedEntityData);
  });

  it("Returns correct data for quality measures with some completed measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockHalfCompletedQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(
      mockHalfCompletedQualityMeasuresFormattedEntityData
    );
  });

  it("Returns correct data for quality measures with fully completed measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockCompletedQualityMeasuresEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockCompletedQualityMeasuresFormattedEntityData);
  });

  it("Returns correct data for sanctions", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.SANCTIONS,
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockCompletedSanctionsFormattedEntityData);
  });

  it("Returns empty object if invalid entity type is passed", () => {
    const entityData = getFormattedEntityData(
      "invalid entity type",
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual({});
  });
});
