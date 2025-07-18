import * as yup from "yup";
import { radioOptional, textOptional } from "./completionSchemas";

export const metadataValidationSchema = yup.object().shape({
  programName: yup.string(),
  reportType: yup.string(),
  locked: yup.bool(),
  status: yup.string(),
  reportingPeriodStartDate: yup.number(),
  reportingPeriodEndDate: yup.number(),
  dueDate: yup.number(),
  combinedData: yup.boolean(),
  programIsPCCM: radioOptional(),
  lastAlteredBy: yup.string(),
  submittedBy: yup.string(),
  submittedOnDate: yup.number(),
  submissionDates: yup.array(),
  previousRevisions: yup.array(),
  submissionCount: yup.number(),
  submissionName: yup.string(),
  completionStatus: yup.mixed(),
  copyFieldDataSourceId: yup.string(),
  planTypeIncludedInProgram: radioOptional(),
  "planTypeIncludedInProgram-otherText": textOptional(),
});
