// types
import { Choice, ChoiceFieldProps, EntityShape, FormJson } from "types";

export const RATE_ID_PREFIX = "measure_rateResults-";

export const createRateField = (id: string, name: string) => ({
  id: `${RATE_ID_PREFIX}${id}`,
  type: "number",
  validation: "number",
  props: {
    label: `${name} results`,
    hint: "If you are reporting results for this performance rate for this reporting period, enter a number. Enter “NR” if you are suppressing data for data privacy purposes. Enter “N/A” for all other reasons.",
  },
});

export const addRatesToForm = (form: FormJson, measure: EntityShape) => {
  const rates = measure.measure_rates;
  if (!rates) return form;

  const copiedDrawerForm = structuredClone(form);
  const isReportingField = copiedDrawerForm.fields.find(
    (field) => field.id === "measure_isReporting"
  );
  const answeredYesField: ChoiceFieldProps =
    isReportingField?.props?.choices?.find(
      (field: Choice) => field.id === "xvBx2RGFpvmUf2Wk5bLe9u"
    );

  for (const rate of rates) {
    answeredYesField.children.push(createRateField(rate.id, rate.name));
  }
  return copiedDrawerForm;
};
