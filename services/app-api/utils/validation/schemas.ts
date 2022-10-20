import * as yup from "yup";

export const metadataValidationSchema = yup.object().shape({
  programName: yup.string(),
  reportType: yup.string(),
  status: yup.string(),
  reportingPeriodStartDate: yup.number(),
  reportingPeriodEndDate: yup.number(),
  dueDate: yup.number(),
  combinedData: yup.boolean(),
  lastAlteredBy: yup.string(),
  submittedBy: yup.string(),
  submittedOnDate: yup.string(),
  formTemplate: yup.mixed(),
  fieldData: yup.mixed(),
});

export const archiveValidationSchema = yup.object().shape({
  archive: yup.boolean(),
});
