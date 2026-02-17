import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const programCharacteristicsRoute: DrawerFormRoute = {
  name: "I: Program Characteristics",
  path: "/mcpar/plan-level-indicators/program-characteristics",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic I. Program Characteristics & Enrollment",
      spreadsheet: "D1_Plan_Set",
    },
    dashboardTitle: "Report program characteristics & enrollment for each plan",
    drawerTitle: "Report program characteristics & enrollment for {{name}}",
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
    id: "dpc",
    fields: [
      {
        id: "plan_enrollment",
        type: ReportFormFieldType.NUMBER_SUPPRESSIBLE,
        validation: ValidationType.NUMBER_SUPPRESSIBLE,
        props: {
          label: "D1.I.1 Plan enrollment",
          hint: "Enter the average number of individuals enrolled in the plan per month during the reporting year (i.e., average member months).",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_medicaidEnrollmentSharePercentage",
        type: ReportFormFieldType.NUMBER_SUPPRESSIBLE,
        validation: ValidationType.NUMBER_SUPPRESSIBLE,
        props: {
          label: "D1.I.2 Plan share of Medicaid",
          hint: [
            {
              type: "span",
              content:
                "What is the plan enrollment (within the specific program) as a percentage of the state’s total Medicaid enrollment?",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content: "Numerator: Plan enrollment (D1.I.1)",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content: "Denominator: Statewide Medicaid enrollment (B.I.1)",
              props: {
                className: "fake-list-item",
              },
            },
          ],
          mask: "percentage",
        },
      },
      {
        id: "plan_medicaidManagedCareEnrollmentSharePercentage",
        type: ReportFormFieldType.NUMBER_SUPPRESSIBLE,
        validation: ValidationType.NUMBER_SUPPRESSIBLE,
        props: {
          label: "D1.I.3 Plan share of risk-based Medicaid managed care",
          hint: [
            {
              type: "span",
              content:
                "What is the plan enrollment (regardless of program) as a percentage of total Medicaid enrollment in risk-based managed care?",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content: "Numerator: Plan enrollment (D1.I.1)",
              props: {
                className: "fake-list-item",
              },
            },
            {
              type: "span",
              content:
                "Denominator: Statewide Medicaid risk-based managed care enrollment (B.I.2)",
              props: {
                className: "fake-list-item",
              },
            },
          ],
          mask: "percentage",
        },
      },
      {
        id: "plan_parentOrganization",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label:
            "D1.I.4: Parent Organization: The name of the parent entity that controls the Medicaid Managed Care Plan.",
          hint: "If the managed care plan is owned or controlled by a separate entity (parent), report the name of that entity. If the managed care plan is not controlled by a separate entity, please report the managed care plan name in this field.",
        },
      },
    ],
  },
};
