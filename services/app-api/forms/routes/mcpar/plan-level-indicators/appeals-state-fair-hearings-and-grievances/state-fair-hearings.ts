import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const stateFairHearingsRoute: DrawerFormRoute = {
  name: "State Fair Hearings",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/state-fair-hearings",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic IV. Appeals, State Fair Hearings & Grievances",
      spreadsheet: "D1_Plan_Set",
      info: [
        {
          type: "heading",
          as: "h4",
          content: "State Fair Hearings",
        },
      ],
    },
    dashboardTitle:
      "Report state fair hearings and external medical reviews for each plan",
    drawerTitle:
      "Report state fair hearings and external medical reviews for {{name}}",
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
    id: "dsfh",
    fields: [
      {
        id: "plan_stateFairHearingRequestsFiled",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.8a State Fair Hearing requests",
          hint: "Enter the total number of State Fair Hearing requests resolved during the reporting year with the plan that issued an adverse benefit determination.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_stateFairHearingRequestsWithFavorableDecision",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.8b State Fair Hearings resulting in a favorable decision for the enrollee",
          hint: "Enter the total number of State Fair Hearing decisions rendered during the reporting year that were partially or fully favorable to the enrollee.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_stateFairHearingRequestsWithAdverseDecision",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.8c State Fair Hearings resulting in an adverse decision for the enrollee",
          hint: "Enter the total number of State Fair Hearing decisions rendered during the reporting year that were adverse for the enrollee.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_stateFairHearingRequestsRetracted",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.8d State Fair Hearings retracted prior to reaching a decision",
          hint: "Enter the total number of State Fair Hearing decisions retracted (by the enrollee or the representative who filed a State Fair Hearing request on behalf of the enrollee) during the reporting year prior to reaching a decision.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_stateFairHearingRequestsWithExternalMedicalReviewWithFavorableDecision",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.9a External Medical Reviews resulting in a favorable decision for the enrollee",
          hint: [
            {
              type: "span",
              content:
                "If your state does offer an external medical review process, enter the total number of external medical review decisions rendered during the reporting year that were partially or fully favorable to the enrollee. If your state does not offer an external medical review process, enter “N/A”.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "External medical review is defined and described at 42 CFR §438.402(c)(i)(B).",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_stateFairHearingRequestsWithExternalMedicalReviewWithAdverseDecision",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.9b External Medical Reviews resulting in an adverse decision for the enrollee",
          hint: [
            {
              type: "span",
              content:
                "If your state does offer an external medical review process, enter the total number of external medical review decisions rendered during the reporting year that were adverse to the enrollee. If your state does not offer an external medical review process, enter “N/A”.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "External medical review is defined and described at 42 CFR §438.402(c)(i)(B).",
              props: {
                className: "fake-paragraph-break",
              },
            },
          ],
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
