import {
  addRatesToForm,
  createRateField,
  RATE_ID_PREFIX,
} from "./qualityMeasures";

const mockQualityMeasureDrawerForm = {
  id: "mock-drawer-form-id",
  fields: [
    {
      id: "measure_isReporting",
      type: "radio",
      validation: "radio",
      props: {
        choices: [
          {
            id: "xvBx2RGFpvmUf2Wk5bLe9u",
            label: "Yes",
            children: [],
          },
          {
            id: "mock-no-choice",
            label: "No",
          },
        ],
      },
    },
  ],
};

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
      const modifiedForm = addRatesToForm(
        mockQualityMeasureDrawerForm as any,
        mockMeasure
      );

      expect(modifiedForm.fields).toHaveLength(1);
      expect(
        mockQualityMeasureDrawerForm.fields[0].props.choices[0].children
      ).toEqual([]);
      expect(modifiedForm.fields[0].props?.choices[0].children).toEqual([
        createRateField(
          mockMeasure.measure_rates[0].id,
          mockMeasure.measure_rates[0].name
        ),
      ]);
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
      expect(rateField.validation).toEqual({
        type: "number",
        nested: true,
        parentFieldName: "measure_isReporting",
        parentOptionId: "xvBx2RGFpvmUf2Wk5bLe9u",
      });
      expect(rateField.props.label).toEqual("mock rate 1 results");
    });
  });
});
