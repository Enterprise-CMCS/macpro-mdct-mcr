import { addRatesToForm } from "./qualityMeasures";
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

describe("addRatesToForm()", () => {
  test("adds rate field", () => {
    expect(mockDrawerForm.fields.length).toBe(1);
    const modifiedForm = addRatesToForm(mockDrawerForm, mockMeasure);
    expect(modifiedForm.fields.length).toBe(2);
  });
});
