import * as yup from "yup";

export const metadataValidationSchema = yup.object().shape({
  programName: yup.string(),
  reportType: yup.string(),
  locked: yup.bool(),
  status: yup.string(),
  reportingPeriodStartDate: yup.number(),
  reportingPeriodEndDate: yup.number(),
  dueDate: yup.number(),
  combinedData: yup.boolean(),
  lastAlteredBy: yup.string(),
  submittedBy: yup.string(),
  submittedOnDate: yup.string(),
  previousRevisions: yup.array(),
  submissionCount: yup.number(),
  submissionName: yup.string(),
  completionStatus: yup.mixed(),
});
