import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../../utils/types";

export const appealsOverviewRoute: DrawerFormRoute = {
  name: "Appeals Overview",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview",
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
          content: "Appeals Overview",
        },
      ],
    },
    dashboardTitle: "Report on appeals for each plan",
    drawerTitle: "Report on appeals for {{name}}",
    drawerInfo: [
      {
        type: "p",
        content:
          "Special Instructions: For MCOs that exclusively serve dually eligible members as applicable integrated plans (defined at 42 CFR 422.561), the MCO should not report Medicare-related appeals in the counts. Medicare-related appeals are those where Medicare is the primary payer.",
      },
    ],
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
    id: "dao",
    fields: [
      {
        id: "plan_resolvedAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.1 Appeals resolved (at the plan level)",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of appeals resolved during the reporting year.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "An appeal is “resolved” at the plan level when the plan has issued a decision, regardless of whether the decision was wholly or partially favorable or adverse to the beneficiary, and regardless of whether the beneficiary (or the beneficiary’s representative) chooses to file a request for a State Fair Hearing or External Medical Review.",
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
        id: "plan_appealsDenied",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.1a Appeals denied",
          hint: "Enter the total number of appeals resolved during the reporting period (D1.IV.1) that were denied (adverse) to the enrollee.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_appealsResolvedInPartialFavorOfEnrollee",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.1b Appeals resolved in partial favor of enrollee",
          hint: "Enter the total number of appeals (D1.IV.1) resolved during the reporting period in partial favor of the enrollee.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_appealsResolvedInFavorOfEnrollee",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.1c Appeals resolved in favor of enrollee",
          hint: "Enter the total number of appeals (D1.IV.1) resolved during the reporting period in favor of the enrollee.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_activeAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.2 Active appeals",
          hint: "Enter the total number of appeals still pending or in process (not yet resolved) as of the end of the reporting year.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_ltssUserFiledAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.3 Appeals filed on behalf of LTSS users",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of appeals filed during the reporting year by or on behalf of LTSS users. Enter “N/A” if not applicable.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "An LTSS user is an enrollee who received at least one LTSS service at any point during the reporting year (regardless of whether the enrollee was actively receiving LTSS at the time that the appeal was filed).",
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
        id: "plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.4 Number of critical incidents filed during the reporting year by (or on behalf of) an LTSS user who previously filed an appeal",
          hint: [
            {
              type: "span",
              content:
                "For managed care plans that cover LTSS, enter the number of critical incidents filed within the reporting year by (or on behalf of) LTSS users who previously filed appeals in the reporting year. If the managed care plan does not cover LTSS, enter “N/A”.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Also, if the state already submitted this data for the reporting year via the CMS readiness review appeal and grievance report (because the managed care program or plan were new or serving new populations during the reporting year), and the readiness review tool was submitted for at least 6 months of the reporting year, enter “N/A”.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "The appeal and critical incident do not have to have been “related” to the same issue - they only need to have been filed by (or on behalf of) the same enrollee. Neither the critical incident nor the appeal need to have been filed in relation to delivery of LTSS — they may have been filed for any reason, related to any service received (or desired) by an LTSS user.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "To calculate this number, states or managed care plans should first identify the LTSS users for whom critical incidents were filed during the reporting year, then determine whether those enrollees had filed an appeal during the reporting year, and whether the filing of the appeal preceded the filing of the critical incident.",
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
        id: "plan_timelyResolvedStandardAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.5a Standard appeals for which timely resolution was provided",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of standard appeals for which timely resolution was provided by plan within the reporting year.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "See 42 CFR §438.408(b)(2) for requirements related to timely resolution of standard appeals.",
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
        id: "plan_timelyResolvedExpeditedAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.5b Expedited appeals for which timely resolution was provided",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of expedited appeals for which timely resolution was provided by plan within the reporting year.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "See 42 CFR §438.408(b)(3) for requirements related to timely resolution of standard appeals.",
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
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.6a Resolved appeals related to denial of authorization or limited authorization of a service",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s denial of authorization for a service not yet rendered or limited authorization of a service.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "(Appeals related to denial of payment for a service already rendered should be counted in indicator D1.IV.6c).",
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
        id: "plan_resolvedReductionSuspensionTerminationOfPreviouslyAuthorizedServiceAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.6b Resolved appeals related to reduction, suspension, or termination of a previously authorized service",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s reduction, suspension, or termination of a previously authorized service.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedPostServiceAuthorizationDenialAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.6c Resolved appeals related to payment denial",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s denial, in whole or in part, of payment for a service that was already rendered.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedServiceTimelinessAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.6d Resolved appeals related to service timeliness",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s failure to provide services in a timely manner (as defined by the state).",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedUntimelyResponseAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.6e Resolved appeals related to lack of timely plan response to an appeal or grievance",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s failure to act within the timeframes provided at 42 CFR §438.408(b)(1) and (2) regarding the standard resolution of grievances and appeals.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRightToRequestOutOfNetworkCareDenialAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.6f Resolved appeals related to plan denial of an enrollee’s right to request out-of-network care",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s denial of an enrollee’s request to exercise their right, under 42 CFR §438.52(b)(2)(ii), to obtain services outside the network (only applicable to residents of rural areas with only one MCO). If not applicable, enter “N/A.”",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedRequestToDisputeFinancialLiabilityDenialAppeals",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.6g Resolved appeals related to denial of an enrollee’s request to dispute financial liability",
          hint: "Enter the total number of appeals resolved by the plan during the reporting year that were related to the plan’s denial of an enrollee’s request to dispute a financial liability.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
