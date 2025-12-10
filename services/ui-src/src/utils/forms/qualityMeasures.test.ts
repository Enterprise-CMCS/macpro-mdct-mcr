import {
  addRatesToForm,
  createRateField,
  filterRateDataFromPlans,
  RATE_ID_PREFIX,
} from "./qualityMeasures";
// utils
import { mockDrawerForm } from "utils/testing/setupJest";

const mockMeasure = {
  id: "mock-measure-1",
  name: "mock measure 1",
  measure_rates: [
    {
      id: "mock-rate-1",
      name: "mock rate 1",
    },
  ],
};

describe("qualityMeasures utils", () => {
  describe("addRatesToForm()", () => {
    test("adds rate field", () => {
      expect(mockDrawerForm.fields.length).toBe(1);
      const modifiedForm = addRatesToForm(mockDrawerForm, mockMeasure);
      expect(modifiedForm.fields.length).toBe(2);
      expect(modifiedForm.fields[0]).toEqual(mockDrawerForm.fields[0]);
      expect(modifiedForm.fields[1]).toEqual(
        createRateField(
          mockMeasure.measure_rates[0].id,
          mockMeasure.measure_rates[0].name
        )
      );
    });
  });

  describe("createRateField()", () => {
    test("creates form field for quality measure rates", () => {
      const rateField = createRateField(
        mockMeasure.measure_rates[0].id,
        mockMeasure.measure_rates[0].name
      );
      expect(rateField.id).toEqual(`${RATE_ID_PREFIX}mock-rate-1`);
      expect(rateField.type).toEqual("number");
      expect(rateField.validation).toEqual("numberOptional");
      expect(rateField.props.label).toEqual("mock rate 1 results");
    });
  });

  describe("filterRateDataFromPlans()", () => {
    const mockPlansWithRateResults = [
      {
        id: "mock id",
        name: "mock plan name",
        measures: {
          [mockMeasure.id]: {
            [`${RATE_ID_PREFIX}mock-rate-1`]: "123",
            [`${RATE_ID_PREFIX}mock-old-rate`]: "N/A",
          },
        },
      },
    ];
    const mockPlanMeasureData =
      mockPlansWithRateResults[0].measures[mockMeasure.id];

    test("filters rate results from plans", () => {
      filterRateDataFromPlans(
        mockMeasure.measure_rates,
        mockPlansWithRateResults,
        mockMeasure.id
      );
      expect(mockPlanMeasureData?.[`${RATE_ID_PREFIX}mock-rate-1`]).toBe("123");
      expect(
        mockPlanMeasureData?.[`${RATE_ID_PREFIX}mock-old-rate`]
      ).toBeUndefined();
    });
  });
});
