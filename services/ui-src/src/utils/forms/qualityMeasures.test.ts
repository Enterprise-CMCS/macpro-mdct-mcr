import { addRatesToForm, createRateField } from "./qualityMeasures";
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
      expect(rateField.id).toEqual("measure_rate_results-mock-rate-1");
      expect(rateField.type).toEqual("number");
      expect(rateField.validation).toEqual("numberOptional");
      expect(rateField.props.label).toEqual("mock rate 1 results");
    });
  });
});
