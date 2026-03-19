import {
  addEditEntityModifications,
  entityWasUpdated,
  getAddEditDrawerText,
  getFormattedEntityData,
  getMeasureResults,
} from "./entities";
// types
import { EntityType } from "types";
// utils
import {
  mockAccessMeasuresEntity,
  mockCompletedAccessMeasuresFormattedEntityData,
  mockSanctionsEntity,
  mockCompletedSanctionsFormattedEntityData,
  mockReportFieldData,
  mockModalDrawerReportPageVerbiage,
  mockQualityMeasuresEntity,
  mockQualityMeasuresEntityV2,
  mockCompletedQualityMeasuresFormattedEntityData,
  mockPlanEntities,
  mockMeasureResults,
} from "utils/testing/setupJest";
import { RATE_ID_PREFIX } from "utils/forms/qualityMeasures";

describe("utils/reports/entities", () => {
  describe("getAddEditDrawerText()", () => {
    describe("entity type: access measures", () => {
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
      test("returns 'Edit' when assessmentDate exists for QUALITY_MEASURES", () => {
        const result = getAddEditDrawerText(
          EntityType.QUALITY_MEASURES,
          { perPlanResponses: [{ response: "Mock response" }] },
          mockModalDrawerReportPageVerbiage
        );
        expect(result).toBe("Edit Mock drawer title");
      });
    });

    describe("entity type: sanctions", () => {
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
      test("returns 'Edit' when assessmentDate exists for PLANS", () => {
        const result = getAddEditDrawerText(
          EntityType.PLANS,
          {},
          mockModalDrawerReportPageVerbiage
        );
        expect(result).toBe("Add Mock drawer title");
      });
    });
  });

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
    });

    describe("entity type: quality measures", () => {
      test("Returns correct data for  quality measures", () => {
        const entityData = getFormattedEntityData(
          EntityType.QUALITY_MEASURES,
          mockQualityMeasuresEntity,
          mockReportFieldData
        );
        expect(entityData).toEqual(
          mockCompletedQualityMeasuresFormattedEntityData
        );
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
    });

    describe("entity type: plans", () => {
      const mockPlanData = {
        id: "mock id",
        name: "mock plan name",
      };

      test("Returns just a heading when no exception or non-compliance status given", () => {
        const entityData = getFormattedEntityData(
          EntityType.PLANS,
          mockPlanData
        );

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

  describe("getMeasureResults()", () => {
    test("returns correct measure results", () => {
      const result = getMeasureResults(
        mockQualityMeasuresEntityV2.id,
        mockPlanEntities,
        mockQualityMeasuresEntityV2.measure_rates,
        []
      );
      expect(result).toEqual(mockMeasureResults);
    });
  });

  describe("entityWasUpdated()", () => {
    const original = { id: "mock-id" };

    test("returns true", () => {
      const updated = { id: "mock-id", updated: true };
      expect(entityWasUpdated(original, updated)).toBe(true);
    });

    test("returns false", () => {
      const updated = { id: "mock-id" };
      expect(entityWasUpdated(original, updated)).toBe(false);
    });
  });

  describe("addEditEntityModifications()", () => {
    const mockMeasures = [
      {
        id: "mock-measure-1",
        name: "mock measure 1",
        measure_rates: [
          {
            id: "mock-rate-1",
            name: "mock rate 1",
          },
        ],
      },
    ];

    const mockPlans = [
      {
        id: "mock id",
        name: "mock plan name",
        measures: {
          [mockMeasures[0].id]: {
            [`${RATE_ID_PREFIX}mock-rate-1`]: "123",
            [`${RATE_ID_PREFIX}mock-old-rate`]: "N/A",
          },
        },
      },
    ];
    test("returns field data when no further modifications needed", () => {
      const result = addEditEntityModifications(
        EntityType.PLANS,
        mockPlans,
        mockPlans[0],
        mockPlans
      );
      expect(result).toEqual({
        [EntityType.PLANS]: mockPlans,
      });
    });

    const mockPlanMeasureData = mockPlans[0].measures[mockMeasures[0].id];

    test("returns modified field data when measures, plans, and rates present", () => {
      addEditEntityModifications(
        EntityType.QUALITY_MEASURES,
        mockMeasures,
        mockMeasures[0],
        mockPlans
      );
      expect(mockPlanMeasureData?.[`${RATE_ID_PREFIX}mock-rate-1`]).toBe("123");
      expect(
        mockPlanMeasureData?.[`${RATE_ID_PREFIX}mock-old-rate`]
      ).toBeUndefined();
    });
  });
});
