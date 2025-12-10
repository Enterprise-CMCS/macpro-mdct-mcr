// types
import { EntityShape, FormJson } from "types";

export const RATE_ID_PREFIX = "measure_rate_results-";

export const createRateField = (id: string, name: string) => ({
  id: `${RATE_ID_PREFIX}${id}`,
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

export const filterRateDataFromPlans = (
  measureRates: EntityShape[],
  plans: EntityShape[],
  measureId: string
) => {
  const measureRateIds = measureRates.map((rate: EntityShape) => rate.id);

  for (const plan of plans) {
    const planMeasureData = plan.measures[measureId];
    const planRateIds = Object.keys(planMeasureData).filter((fieldId) =>
      fieldId.startsWith(RATE_ID_PREFIX)
    );
    const rateIdsToDelete = planRateIds.filter(
      (id) => !measureRateIds.includes(id.split(RATE_ID_PREFIX)[1])
    );
    rateIdsToDelete.forEach((rateId: string) => {
      delete planMeasureData[rateId];
    });
  }
};
