import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../utils/types";

export const mlrReportingRoute: DrawerFormRoute = {
  name: "II: MLR Reporting",
  path: "/mcpar/plan-level-indicators/mlr-reporting",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic II: Medical Loss Ratio (MLR) Reporting",
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
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the plans that participate in this program in section A.7.",
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
          hint: "Has the state received the MLR data specified at 42 CFR 438.8(k) from this plan for the current MCPAR reporting period as of the submission date of this MCPAR report?",
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
                        children: [
                          {
                            id: "agvm79QjeMahTuwFAeP5LEOC",
                            type: ReportFormFieldType.DATE_MONTH_YEAR,
                            validation: {
                              type: ValidationType.DATE_MONTH_YEAR,
                              nested: true,
                              parentFieldName: "plan_mlrDataValidated",
                              parentOptionId: "pQ8rS0tU2vW4xY6zA8bC0d",
                            },
                            props: {
                              label:
                                "D1.II.1b Projected Date for Validation of MLR Data for This Reporting Period",
                              hint: "When does the state anticipate completing validation for this plan?",
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "eF2gH4iJ6kL8mN0oP2qR4s",
              label: "No",
              children: [
                {
                  id: "6Mtk0HNtmiqcgNyAhkT9dlRH",
                  type: ReportFormFieldType.DATE_MONTH_YEAR,
                  validation: {
                    type: ValidationType.DATE_MONTH_YEAR,
                    nested: true,
                    parentFieldName: "plan_mlrDataReceived",
                    parentOptionId: "eF2gH4iJ6kL8mN0oP2qR4s",
                  },
                  props: {
                    label:
                      "D1.II.1c Projected Date for Receipt of MLR Data for This Reporting Period",
                    hint: "When does the state anticipate receiving MLR data for this reporting period from this plan?",
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
