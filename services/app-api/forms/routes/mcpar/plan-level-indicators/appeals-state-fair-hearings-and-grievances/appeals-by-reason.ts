import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const appealsByReasonRoute: DrawerFormRoute = {
  name: "Appeals by Reason",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/appeals-by-reason",
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
          content: "Appeals by Reason",
        },
        {
          type: "p",
          content:
            "Number of appeals resolved during the reporting period related to various services. Note: A single appeal may be related to multiple service types and may therefore be counted in multiple categories.",
        },
      ],
    },
    dashboardTitle: "Report on appeals by reason for each plan",
    drawerTitle: "Report appeals by reason for {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won't be able to complete this section until you've added all the plans that participate in this program in section A.7. ",
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
    id: "dabr",
    fields: [
      {
        id: "D1.IV.6Header",
        type: ReportFormFieldType.SECTION_HEADER,
        props: {
          divider: "top",
          content:
            "Number of appeals due to the following reasons resolved during the reporting period:",
        },
      },
      {
        id: "D1.IV.6Instructions",
        type: ReportFormFieldType.SECTION_CONTENT,
        props: {
          content:
            "The seven reasons for an appeal are mutually exclusive. Each appeal has one reason, and questions D1.IV.6a-g should sum to D1.IV.1.",
        },
      },
      {
        id: "plan_resolvedPreServiceAuthorizationDenialAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content:
            "D1.IV.6a Resolved appeals related to denial of authorization or limited authorization of a service",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of authorization for a service not yet rendered or limited authorization of a service. (Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).",
        },
      },
      {
        id: "plan_resolvedPreServiceAuthorizationDenialAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedPreServiceAuthorizationDenialAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedPreServiceAuthorizationDenialAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content:
            "D1.IV.6b Resolved appeals related to reduction, suspension, or termination of a previously authorized service",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's reduction, suspension, or termination of a previously authorized service.",
        },
      },
      {
        id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedPostServiceAuthorizationDenialAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content: "D1.IV.6c Resolved appeals related to payment denial",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial, in whole or in part, of payment for a service that was already rendered.",
        },
      },
      {
        id: "plan_resolvedPostServiceAuthorizationDenialAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedPostServiceAuthorizationDenialAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedPostServiceAuthorizationDenialAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedServiceTimelinessAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content: "D1.IV.6d Resolved appeals related to service timeliness",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's failure to provide services in a timely manner (as defined by the state).",
        },
      },
      {
        id: "plan_resolvedServiceTimelinessAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedServiceTimelinessAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedServiceTimelinessAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedUntimelyResponseAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content:
            "D1.IV.6e Resolved appeals related to lack of timely plan response to an appeal or grievance",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's failure to act within the timeframes provided at 42 CFR §438.408(b)(1) and (2) regarding the standard resolution of grievances and appeals.",
        },
      },
      {
        id: "plan_resolvedUntimelyResponseAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedUntimelyResponseAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedUntimelyResponseAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content:
            "D1.IV.6f Resolved appeals related to plan denial of an enrollee's right to request out-of-network care",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of an enrollee's request to exercise their right, under 42 CFR §438.52(b)(2)(ii), to obtain services outside the network (only applicable to residents of rural areas with only one MCO). If not applicable, enter “N/A.”",
        },
      },
      {
        id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED_OR_NA_NR,
        validation: ValidationType.NUMBER_OR_SUPPRESSED_OR_NA_NR,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED_OR_NA_NR,
        validation: ValidationType.NUMBER_OR_SUPPRESSED_OR_NA_NR,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED_OR_NA_NR,
        validation: ValidationType.NUMBER_OR_SUPPRESSED_OR_NA_NR,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals",
        type: ReportFormFieldType.QUESTION,
        props: {
          content:
            "D1.IV.6g Resolved appeals related to denial of an enrollee's request to dispute financial liability",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan's denial of an enrollee's request to dispute a financial liability.",
        },
      },
      {
        id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppealsFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppealsPartiallyFavorable",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Partially favorable to the enrollee",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppealsDenied",
        type: ReportFormFieldType.NUMBER_OR_SUPPRESSED,
        validation: ValidationType.NUMBER_OR_SUPPRESSED,
        props: {
          label: "Denied",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
