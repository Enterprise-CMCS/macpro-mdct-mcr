import {
  EntityType,
  FormDrawerFormRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../utils/types";

export const priorAuthorizationRoute: FormDrawerFormRoute = {
  name: "XIII: Prior Authorization",
  path: "/mcpar/plan-level-indicators/prior-authorization",
  pageType: PageTypes.DRAWER,
  entityType: EntityType.PLANS,
  verbiage: {
    intro: {
      section: "Section D: Plan-Level Indicators",
      subsection: "Topic XIII. Prior Authorization",
      spreadsheet: "D1_Plan_Set",
      alert:
        "<b>Beginning June 2026, Indicators D1.XIII.1-15 must be completed. Submission of this data including partial reporting on some but not all plans, before June 2026 is optional; if you choose not to respond prior to June 2026, select “Not reporting data”.</b>",
    },
    dashboardTitle:
      "Report on prior authorization requests received for each plan",
    drawerTitle: "Prior authorization for {{name}}",
    missingEntityMessage: [
      {
        type: "p",
        children: [
          {
            type: "html",
            content:
              "This program is missing plans. You won’t be able to complete this section until you’ve added all the managed care plans that serve enrollees in the program. ",
          },
          {
            type: "internalLink",
            content: "Add Plans",
            props: {
              to: "/mcpar/program-information/add-plans",
            },
          },
          {
            type: "html",
            content: ".",
          },
        ],
      },
    ],
  },
  form: {
    id: "pa",
    fields: [
      {
        id: "plan_priorAuthorizationReporting",
        type: ReportFormFieldType.RADIO,
        validation: ValidationType.RADIO,
        props: {
          label: "Are you reporting data prior to June 2026?",
          hint: "If “Yes”, please complete the following questions under each plan.",
          choices: [
            {
              id: "IELJsTZxQkFDkTMzWQkKocwb",
              label: "Not reporting data",
            },
            {
              id: "bByTWRIwTSTBncyZRUiibagB",
              label: "Yes",
            },
          ],
        },
      },
    ],
  },
  drawerForm: {
    id: "dpa",
    fields: [
      {
        id: "plan_urlForPriorAuthorizationDataOnPlanWebsite",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label: "D1.XIII.1 URL for prior authorization data on plan’s website",
          hint: "Provide the URL where the plan posts prior authorization data for all items and services excluding drugs, as required in 42 CFR § 438.210(f). If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
        },
      },
      {
        id: "plan_urlForListOfAllItemsAndServicesSubjectToPriorAuthorization",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
        props: {
          label:
            "D1.XIII.2 URL for list of all items and services subject to prior authorization",
          hint: "Provide the URL where the plan posts the list of all items and services, excluding drugs, that are subject to prior authorization, as required in 42 CFR § 438.210(f)(1). If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
        },
      },
      {
        id: "plan_totalStandardPriorAuthorizationRequestsReceived",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.3 Total standard prior authorization requests received",
          hint: "Enter the total number of standard prior authorization requests received by the plan for all items and services, excluding drugs, during the prior calendar year. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_totalExpeditedPriorAuthorizationRequestsReceived",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.4 Total expedited prior authorization requests received",
          hint: "Enter the total number of expedited prior authorization requests received by the plan for all items and services, excluding drugs, during the prior calendar year. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_totalStandardAndExpeditedPriorAuthorizationRequestsReceived",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.5 Total standard and expedited prior authorization requests received",
          hint: "Enter the total number of standard and expedited prior authorization requests received (D1.XIII.3 plus D1.XIII.4) by the plan during the prior calendar year. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 0,
        },
      },
      {
        id: "plan_percentageOfStandardPriorAuthorizationRequestsApproved",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.6 Percentage of standard prior authorization requests that were approved",
          hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the percentage that were fully approved. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_percentageOfStandardPriorAuthorizationRequestsDenied",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.7 Percentage of standard prior authorization requests that were denied",
          hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the percentage that were fully or partially denied. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_percentageOfStandardPriorAuthorizationRequestsApprovedAfterAppeal",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.8 Percentage of standard prior authorization requests approved after appeal",
          hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the percentage that were approved after appeal. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_averageTimeToDecisionForStandardPriorAuthorizations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.9 Average time to decision for standard prior authorizations",
          hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the average number of days that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_medianTimeToDecisionOnStandardPriorAuthorizations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.10 Median time to decision on standard prior authorizations",
          hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the median number of days that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_percentageOfExpeditedPriorAuthorizationRequestsApproved",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.11 Percentage of expedited prior authorization requests that were approved",
          hint: "Of the total expedited prior authorization requests reported in D1.XIII.4, enter the percentage that were approved. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_percentageOfExpeditedPriorAuthorizationRequestsDenied",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.12 Percentage of expedited prior authorization requests that were denied",
          hint: "Of the total expedited prior authorization requests, as reported in D1.XIII.4, enter the percentage that were denied. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_averageTimeToDecisionForExpeditedPriorAuthorizations",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.13 Average time to decision for expedited prior authorizations",
          hint: "Of the total expedited prior authorization requests, as reported in D1.XIII.4, enter the average number of hours that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_medianTimeToDecisionOnExpeditedPriorAuthorizationRequests",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
        props: {
          label:
            "D1.XIII.14 Median time to decision for expedited prior authorizations",
          hint: "Of the total expedited prior authorization requests, as reported in D1.XIII.4, enter the median number of hours that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          decimalPlacesToRoundTo: 2,
        },
      },
      {
        id: "plan_percentageOfTotalPriorAuthorizationRequestsApprovedWithExtendedTimeframe",
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER_NOT_LESS_THAN_ZERO,
        props: {
          label:
            "D1.XIII.15 Percentage of total prior authorization requests approved with extended timeframe",
          hint: "Of the total prior authorization requests, as reported in D1.XIII.5, enter the percentage of requests for which the timeframe for review was extended and the request was approved. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
          mask: "percentage",
          decimalPlacesToRoundTo: 2,
        },
      },
    ],
  },
};
