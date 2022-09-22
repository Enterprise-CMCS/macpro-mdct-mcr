import * as yup from "yup";

export const metadataValidationSchema = yup.object().shape({
  programName: yup.string(),
  reportType: yup.string(),
  status: yup.string(),
  reportingPeriodStartDate: yup.number(),
  reportingPeriodEndDate: yup.number(),
  dueDate: yup.number(),
  combinedData: yup
    .array()
    .of(yup.object({ key: yup.string(), value: yup.string() })),
  lastAlteredBy: yup.string(),
  submittedBy: yup.string(),
  submittedOnDate: yup.string(),
  formTemplate: yup.mixed(),
  fieldData: yup.mixed(),
});
