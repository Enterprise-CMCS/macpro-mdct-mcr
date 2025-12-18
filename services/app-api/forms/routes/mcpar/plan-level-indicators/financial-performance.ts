import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const financialPerformanceRoute: DrawerFormRoute = {
  name: "II: Financial Performance",
  path: "/mcpar/plan-level-indicators/financial-performance",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic II. Financial Performance",
      spreadsheet: "D1_Plan_Set",
    },
    dashboardTitle: "Report financial performance for each plan",
    drawerTitle: "Report financial performance for {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/mcpar/program-information/add-plans",
            },
          },
        ],
      },
    ],
  },
  drawerForm: {
    id: "dfp",
    fields: [
      {
        id: "plan_mlrDataReceived",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D1.II.1 MLR Data Received",
          hint: "Has the state received the final MLR data specified at 42 CFR 438.8(k) from this plan for the current MCPAR reporting period as of the submission date of this MCPAR report?",
          choices: [
            {
              id: "xY7zW9vU3tS1rQ5pO8nM2k",
              label: "Yes",
              children: [
                {
                  id: "plan_mlrDataValidated",
                  type: ReportFormFieldType.RADIO,
                  validation: {
                    type: ValidationType.RADIO,
                    nested: true,
                    parentFieldName: "plan_mlrDataReceived",
                  },
                  props: {
                    label: "D1.II.1a MLR Data Validated",
                    hint: "Has the state validated the final MLR data specified at 42 CFR 438.8(k) from this plan for the current MCPAR reporting period as of the submission date of this MCPAR report?",
                    choices: [
                      {
                        id: "aB4cD6eF8gH0iJ2kL4mN6o",
                        label: "Yes",
                      },
                      {
                        id: "pQ8rS0tU2vW4xY6zA8bC0d",
                        label: "No",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "eF2gH4iJ6kL8mN0oP2qR4s",
              label: "No",
            },
          ],
        },
      },
      {
        id: "plan_medicalLossRatioPercentage",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.II.1a Medical Loss Ratio (MLR)",
          hint: "What is the MLR percentage? Per 42 CFR 438.66(e)(2)(i), the Managed Care Program Annual Report must provide information on the Financial performance of each MCO, PIHP, and PAHP, including MLR experience.</br>If MLR data are not available for this reporting period due to data lags, enter the MLR calculated for the most recently available reporting period and indicate the reporting period in item D1.II.3 below. See Glossary in Excel Workbook for the regulatory definition of MLR. Write MLR as a percentage: for example, write 92% rather than 0.92.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_medicalLossRatioPercentageAggregationLevel",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D1.II.1b Level of aggregation",
          hint: "What is the aggregation level that best describes the MLR being reported in the previous indicator? Select one.</br>As permitted under 42 CFR 438.8(i), states are allowed to aggregate data for reporting purposes across programs and populations.",
          choices: [
            {
              id: "BSfARaemtUmbuMnZC11pog",
              label: "Program-specific statewide",
            },
            {
              id: "Sk684CJrvE6vAefOKX6flA",
              label: "Program-specific regional",
            },
            {
              id: "LRDviCXq5ESAYi3UhGhMBw",
              label: "Statewide all programs & populations",
            },
            {
              id: "OQ0onGPAMUqDZgIxAjR3aQ",
              label: "Regional all programs & populations",
            },
            {
              id: "ou7IxaZKnEeGLuqBSehl9g",
              label: "Other, specify",
              children: [
                {
                  id: "plan_medicalLossRatioPercentageAggregationLevel-otherText",
                  type: ReportFormFieldType.TEXTAREA,
                  validation: {
                    type: ValidationType.TEXT,
                    nested: true,
                    parentFieldName:
                      "plan_medicalLossRatioPercentageAggregationLevel",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "plan_populationSpecificMedicalLossRatioDescription",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT,
        props: {
          label: "D1.II.2 Population specific MLR description",
          hint: "Does the state require plans to submit separate MLR calculations for specific populations served within this program, for example, MLTSS or Group VIII expansion enrollees? If so, describe the populations here. Enter “N/A” if not applicable.</br>See glossary for the regulatory definition of MLR.",
        },
      },
      {
        id: "plan_medicalLossRatioReportingPeriod",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "D1.II.3 MLR reporting period discrepancies",
          hint: "Does the data reported in item D1.II.1a cover a different time period than the MCPAR report?",
          choices: [
            {
              id: "UgEFak34A0e1hJaHXtXbrw",
              label: "Yes",
              children: [
                {
                  id: "plan_medicalLossRatioReportingPeriodStartDate",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.DATE,
                    nested: true,
                    parentFieldName: "plan_medicalLossRatioReportingPeriod",
                  },
                  props: {
                    hint: "Enter the start date.",
                    timetype: "startDate",
                  },
                },
                {
                  id: "plan_medicalLossRatioReportingPeriodEndDate",
                  type: ReportFormFieldType.DATE,
                  validation: {
                    type: ValidationType.END_DATE,
                    dependentFieldName:
                      "plan_medicalLossRatioReportingPeriodStartDate",
                    nested: true,
                    parentFieldName: "plan_medicalLossRatioReportingPeriod",
                  },
                  props: {
                    hint: "Enter the end date.",
                    timetype: "endDate",
                  },
                },
              ],
            },
            {
              id: "Jt8dUZQO60OpeGvhe6KaOA",
              label: "No",
            },
          ],
        },
      },
    ],
  },
};
