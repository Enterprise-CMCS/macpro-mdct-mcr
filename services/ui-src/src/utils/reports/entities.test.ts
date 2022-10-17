import { getFormattedEntityData } from "./entities";
import { ModalDrawerEntityTypes } from "types";
import {
  mockAccessMeasuresEntity,
  mockCompletedAccessMeasuresFormattedEntityData,
  mockSanctionsEntity,
  mockCompletedSanctionsFormattedEntityData,
} from "utils/testing/setupJest";

const mockReportFieldData = {
  plans: [
    {
      id: "mock-plan-id",
      name: "mock-plan-name",
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

  it("Test getFormattedEntityData returns correct data for sanctions", () => {
    const entityData = getFormattedEntityData(
      ModalDrawerEntityTypes.SANCTIONS,
      mockSanctionsEntity,
      mockReportFieldData
    );
    expect(entityData).toEqual(mockCompletedSanctionsFormattedEntityData);
  });
});
