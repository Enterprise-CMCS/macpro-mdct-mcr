import {
  DrawerFormRoute,
  EntityType,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";

export const grievancesByReasonRoute: DrawerFormRoute = {
  name: "Grievances by Reason",
  path: "/mcpar/plan-level-indicators/appeals-state-fair-hearings-grievances/grievances-by-reason",
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
          content: "Grievances by Reason",
        },
        {
          type: "p",
          content:
            "Report the number of grievances resolved by plan during the reporting period by reason.",
        },
      ],
    },
    dashboardTitle: "Report on grievances by reason for each plan",
    drawerTitle: "Report on grievances by reason for {{name}}",
    drawerInfo: [
      {
        type: "p",
        content:
          "A single grievance may be related to multiple reasons and may therefore be counted in multiple categories.",
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
    id: "dgbr",
    fields: [
      {
        id: "plan_resolvedCustomerServiceGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16a Resolved grievances related to plan or provider customer service",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to plan or provider customer service.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Customer service grievances include complaints about interactions with the plan’s Member Services department, provider offices or facilities, plan marketing agents, or any other plan or provider representatives.",
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
        id: "plan_resolvedCareCaseManagementGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16b Resolved grievances related to plan or provider care management/case management",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to plan or provider care management/case management.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Care management/case management grievances include complaints about the timeliness of an assessment or complaints about the plan or provider care or case management process.",
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
        id: "plan_resolvedAccessToCareGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16c Resolved grievances related to network adequacy or access to care/services from plan or provider",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to access to care.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Access to care grievances include complaints about difficulties finding qualified in-network providers, excessive travel or wait times, or other access issues.",
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
        id: "plan_resolvedQualityOfCareGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.16d Resolved grievances related to quality of care",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to quality of care.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Quality of care grievances include complaints about the effectiveness, efficiency, equity, patient-centeredness, safety, and/or acceptability of care provided by a provider or the plan.",
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
        id: "plan_resolvedPlanCommunicationGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.16e Resolved grievances related to plan communications",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to plan communications.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Plan communication grievances include grievances related to the clarity or accuracy of enrollee materials or other plan communications or to an enrollee’s access to or the accessibility of enrollee materials or plan communications.",
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
        id: "plan_resolvedPaymentBillingGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16f Resolved grievances related to payment or billing issues",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were filed for a reason related to payment or billing issues.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedSuspectedFraudGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.16g Resolved grievances related to suspected fraud",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to suspected fraud.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Suspected fraud grievances include suspected cases of financial/payment fraud perpetuated by a provider, payer, or other entity. Note: grievances reported in this row should only include grievances submitted to the managed care plan, not grievances submitted to another entity, such as a state Ombudsman or Office of the Inspector General.",
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
        id: "plan_resolvedAbuseNeglectExploitationGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16h Resolved grievances related to abuse, neglect or exploitation",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to abuse, neglect or exploitation.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Abuse/neglect/exploitation grievances include cases involving potential or actual patient harm.",
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
        id: "plan_resolvedUntimelyResponseGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16i Resolved grievances related to lack of timely plan response to a prior authorization/service authorization or appeal (including requests to expedite or extend appeals)",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were filed due to a lack of timely plan response to a service authorization or appeal request (including requests to expedite or extend appeals).",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_resolvedDenialOfExpeditedAppealGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.IV.16j Resolved grievances related to plan denial of expedited appeal",
          hint: [
            {
              type: "span",
              content:
                "Enter the total number of grievances resolved by the plan during the reporting year that were related to the plan’s denial of an enrollee’s request for an expedited appeal.",
              props: {
                className: "fake-paragraph-break",
              },
            },
            {
              type: "span",
              content:
                "Per 42 CFR §438.408(b)(3), states must establish a timeframe for timely resolution of expedited appeals that is no longer than 72 hours after the MCO, PIHP or PAHP receives the appeal. If a plan denies a request for an expedited appeal, the enrollee or their representative have the right to file a grievance.",
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
        id: "plan_resolvedOtherGrievances",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label: "D1.IV.16k Resolved grievances filed for other reasons",
          hint: "Enter the total number of grievances resolved by the plan during the reporting year that were filed for a reason other than the reasons listed above.",
          mask: "comma-separated",
          decimalPlacesToRoundTo: 0,
        },
      },
    ],
  },
};
