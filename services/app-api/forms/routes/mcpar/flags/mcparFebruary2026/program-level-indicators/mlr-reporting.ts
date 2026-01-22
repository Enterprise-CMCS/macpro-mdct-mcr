import {
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../utils/types";

export const mlrReportingRoute: FormRoute = {
  name: "II: MLR Reporting",
  path: "/mcpar/program-level-indicators/mlr-reporting",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "Section C: Program-Level Indicators",
      subsection: "Topic II: Medical Loss Ratio (MLR) Reporting",
      spreadsheet: "C1_Program_Set",
    },
  },
  form: {
    id: "cmlr",
    fields: [
      {
        id: "program_mlrSubmissionDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "C1.II.1 Submission Date of Most Recent MLR Report",
          hint: "When is the last date the state submitted the MLR Summary Report in the Medicaid Data Collection Tool (MDCT) MLR Portal for this program?",
        },
      },
      {
        id: "program_mlrReportingPeriodStartDate",
        type: ReportFormFieldType.DATE,
        validation: ValidationType.DATE,
        props: {
          label: "C1.II.2 Most Recent MLR Reporting Period",
          hint: "Please report the beginning date of that MLR reporting period.",
          timetype: "startDate",
        },
      },
      {
        id: "program_mlrReportingPeriodEndDate",
        type: ReportFormFieldType.DATE,
        validation: {
          type: ValidationType.END_DATE,
          dependentFieldName: "program_mlrReportingPeriodStartDate",
        },
        props: {
          hint: "Please report the end date of that MLR reporting period.",
          timetype: "endDate",
        },
      },
      {
        id: "program_mlrValidationCompletion",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "C1.II.3 MLR Validation Completion",
          hint: "Has the state completed the validation of plan MLR data for the current MCPAR reporting period by the submission date of this report for all plans? (See detailed reporting in Section D1.II by plan.)",
          choices: [
            {
              id: "kL9mNpQr2sT4uVwX5yZ0aB",
              label: "Yes",
            },
            {
              id: "cD3eF6gH7iJ8kL9mNpQr2s",
              label: "No",
              children: [
                {
                  id: "program_mlrAnticipatedValidationDate",
                  type: ReportFormFieldType.DATE_MONTH_YEAR,
                  validation: {
                    type: ValidationType.DATE_MONTH_YEAR,
                    nested: true,
                    parentFieldName: "program_mlrValidationCompletion",
                  },
                  props: {
                    label: "C1.II.3a Anticipated Validation Date",
                    hint: "When does the state anticipate doing so?",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};
