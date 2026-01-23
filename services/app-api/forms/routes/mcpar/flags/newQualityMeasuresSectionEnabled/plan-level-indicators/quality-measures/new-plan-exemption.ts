import {
  EntityType,
  FormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../../utils/types";

export const newPlanExemptionRoute: FormRoute = {
  name: "New plan exemption",
  path: "/mcpar/plan-level-indicators/quality-measures/new-plan-exemption",
  pageType: PageTypes.STANDARD,
  entityType: EntityType.QUALITY_MEASURES,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic VII: Quality & Performance Measures",
      spreadsheet: "D2_Program_QualityMeasures",
      alert:
        "<b>Please be aware checking a plan in this list will clear any entered quality measures data for that plan.</b>",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "New plan exemption",
        },
      ],
    },
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
  form: {
    id: "dqmnpe",
    fields: [
      {
        id: "plansExemptFromQualityMeasures",
        type: ReportFormFieldType.CHECKBOX,
        validation: ValidationType.CHECKBOX_OPTIONAL,
        props: {
          label:
            "D2.VII.1 Place a check on any new plans in this program that are not able to provide quality data for the calendar year you are reporting.",
          choices: [
            {
              id: "generatedCheckbox",
              label: "Plans (generated)",
            },
          ],
        },
      },
    ],
  },
};
