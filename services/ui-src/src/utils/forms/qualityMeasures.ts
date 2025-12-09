import { EntityShape, FormJson } from "types";

export const createRateField = (id: string, name: string) => ({
  id: `measure_rate_results-${id}`,
  type: "number",
  validation: "numberOptional",
  props: {
    label: `${name} results`,
    hint: "If you are reporting results for this performance rate for this reporting period, enter a number. Enter “NR” if you are suppressing data for data privacy purposes. Enter “N/A” for all other reasons.",
  },
});

export const addRatesToForm = (form: FormJson, measure: EntityShape) => {
  const copiedDrawerForm = structuredClone(form);
  const rates = measure.measure_rates;
  for (const rate of rates) {
    copiedDrawerForm.fields.push(createRateField(rate.id, rate.name));
  }
  return copiedDrawerForm;
};
