import { FormJson, ReportFormFieldType, ValidationType } from "types";

export const mlrFormJson: FormJson = {
  id: "aes",
  options: {
    mode: "onChange",
  },
  heading: {
    add: "Add new MLR submission",
    edit: "Edit MLR submission",
  },
  fields: [
    {
      id: "programName",
      type: ReportFormFieldType.TEXT,
      validation: ValidationType.TEXT,
      props: {
        label: "MLR submission name",
        hint: "Name this MLR submission so you can easily refer to it. Consider using timeframe(s) and managed care program names (if relevant).",
      },
    },
  ],
};
