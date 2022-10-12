import { getFormattedEntityData } from "./entities";
import { ModalDrawerEntityTypes } from "types";

const mockAccessMeasuresEntity = {
  id: "mock-access-measures-id",
  accessMeasure_generalCategory: [
    {
      value: "mock-general-category-value",
    },
  ],
  accessMeasure_standardDescription: "mock-description",
  accessMeasure_standardType: [
    {
      value: "mock-standard-type-value",
    },
  ],
  accessMeasure_providerType: [
    {
      value: "mock-provider-type-value",
    },
  ],
  accessMeasure_applicableRegion: [
    {
      value: "Other, specify",
    },
  ],
  "accessMeasure_applicableRegion-otherText": "mock-region-other-text",
  accessMeasure_population: [
    {
      value: "mock-population-value",
    },
  ],
  accessMeasure_monitoringMethods: [
    {
      value: "mock-monitoring-method-1",
    },
    {
      value: "mock-monitoring-method-2",
    },
  ],
  accessMeasure_oversightMethodFrequency: [
    {
      value: "mock-oversight-method-frequency",
    },
  ],
};
const mockSanctionsEntity = {
  id: "mock-sanctions-id",
};
const mockQualityMeasuresEntity = {
  id: "mock-quality-measures-id",
};

describe("Test getFormattedEntityData", () => {
  it("Test getFormattedEntityData returns correct data for access measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.ACCESS_MEASURES,
      mockAccessMeasuresEntity
    );
    expect(entityData.category).toEqual("mock-general-category-value");
    expect(entityData.standardDescription).toEqual("mock-description");
    expect(entityData.standardType).toEqual("mock-standard-type-value");
    expect(entityData.provider).toEqual("mock-provider-type-value");
    expect(entityData.region).toEqual("mock-region-other-text");
    expect(entityData.population).toEqual("mock-population-value");
    expect(entityData.monitoringMethods).toEqual([
      "mock-monitoring-method-1",
      "mock-monitoring-method-2",
    ]);
    expect(entityData.methodFrequency).toEqual(
      "mock-oversight-method-frequency"
    );
  });
  it("Test getFormattedEntityData returns correct data for sanctions", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.SANCTIONS,
      mockSanctionsEntity
    );
    expect(entityData).toEqual({});
  });
  it("Test getFormattedEntityData returns correct data for quality measures", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.QUALITY_MEASURES,
      mockQualityMeasuresEntity
    );
    expect(entityData).toEqual({});
  });
});
