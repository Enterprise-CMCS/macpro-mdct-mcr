import { deletePlanData, getFieldsToFilter } from "./deletePlanData";

const mockPlanData = [
  {
    id: "mock-id",
    plan_urlForPriorAuthorizationDataOnPlanWebsite: "https://www.google.com",
    plan_urlForListOfAllItemsAndServicesSubjectToPriorAuthorization:
      "https://www.google.com",
    plan_totalStandardPriorAuthorizationRequestsReceived: 1,
    plan_totalExpeditedPriorAuthorizationRequestsReceived: 2,
    plan_totalStandardAndExpeditedPriorAuthorizationRequestsReceived: 3,
    plan_percentageOfStandardPriorAuthorizationRequestsApproved: "12%",
    plan_percentageOfStandardPriorAuthorizationRequestsDenied: "43%",
    plan_percentageOfStandardPriorAuthorizationRequestsApprovedAfterAppeal:
      "56%",
    plan_averageTimeToDecisionForStandardPriorAuthorizations: 4,
    plan_medianTimeToDecisionOnStandardPriorAuthorizations: 5,
    plan_percentageOfExpeditedPriorAuthorizationRequestsApproved: "78%",
    plan_percentageOfExpeditedPriorAuthorizationRequestsDenied: "99%",
    plan_averageTimeToDecisionForExpeditedPriorAuthorizations: 6,
    plan_medianTimeToDecisionOnExpeditedPriorAuthorizationRequests: 7,
    plan_percentageOfTotalPriorAuthorizationRequestsApprovedWithExtendedTimeframe:
      "100%",
  },
];

const priorAuthorizationFields = [
  "plan_urlForPriorAuthorizationDataOnPlanWebsite",
  "plan_urlForListOfAllItemsAndServicesSubjectToPriorAuthorization", // pragma: allowlist secret
  "plan_totalStandardPriorAuthorizationRequestsReceived",
  "plan_totalExpeditedPriorAuthorizationRequestsReceived",
  "plan_totalStandardAndExpeditedPriorAuthorizationRequestsReceived",
  "plan_percentageOfStandardPriorAuthorizationRequestsApproved",
  "plan_percentageOfStandardPriorAuthorizationRequestsDenied",
  "plan_percentageOfStandardPriorAuthorizationRequestsApprovedAfterAppeal",
  "plan_averageTimeToDecisionForStandardPriorAuthorizations",
  "plan_medianTimeToDecisionOnStandardPriorAuthorizations",
  "plan_percentageOfExpeditedPriorAuthorizationRequestsApproved",
  "plan_percentageOfExpeditedPriorAuthorizationRequestsDenied",
  "plan_averageTimeToDecisionForExpeditedPriorAuthorizations",
  "plan_medianTimeToDecisionOnExpeditedPriorAuthorizationRequests",
  "plan_percentageOfTotalPriorAuthorizationRequestsApprovedWithExtendedTimeframe",
];

const mockPlanLevelIndicators = [
  {
    name: "D: Plan-Level Indicators",
    path: "/mcpar/plan-level-indicators",
    children: [
      {
        name: "XIII: Prior Authorization",
        path: "/mcpar/plan-level-indicators/prior-authorization",
        drawerForm: {
          id: "dpa",
          fields: [
            {
              id: "plan_urlForPriorAuthorizationDataOnPlanWebsite",
              type: "text",
              validation: "text",
              props: {
                label:
                  "D1.XIII.1 URL for prior authorization data on plan’s website",
                hint: "Provide the URL where the plan posts prior authorization data for all items and services excluding drugs, as required in 42 CFR § 438.210(f). If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
              },
            },
            {
              id: "plan_urlForListOfAllItemsAndServicesSubjectToPriorAuthorization",
              type: "text",
              validation: "text",
              props: {
                label:
                  "D1.XIII.2 URL for list of all items and services subject to prior authorization",
                hint: "Provide the URL where the plan posts the list of all items and services, excluding drugs, that are subject to prior authorization, as required in 42 CFR § 438.210(f)(1). If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
              },
            },
            {
              id: "plan_totalStandardPriorAuthorizationRequestsReceived",
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.3 Total standard prior authorization requests received",
                hint: "Enter the total number of standard prior authorization requests received by the plan for all items and services, excluding drugs, during the prior calendar year. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "plan_totalExpeditedPriorAuthorizationRequestsReceived",
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.4 Total expedited prior authorization requests received",
                hint: "Enter the total number of expedited prior authorization requests received by the plan for all items and services, excluding drugs, during the prior calendar year. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "plan_totalStandardAndExpeditedPriorAuthorizationRequestsReceived",
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.5 Total standard and expedited prior authorization requests received",
                hint: "Enter the total number of standard and expedited prior authorization requests received (D1.XIII.3 plus D1.XIII.4) by the plan during the prior calendar year. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 0,
              },
            },
            {
              id: "plan_percentageOfStandardPriorAuthorizationRequestsApproved",
              type: "number",
              validation: "number",
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
              type: "number",
              validation: "number",
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
              type: "number",
              validation: "number",
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
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.9 Average time to decision for standard prior authorizations",
                hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the average number of days that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 2,
              },
            },
            {
              id: "plan_medianTimeToDecisionOnStandardPriorAuthorizations",
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.10 Median time to decision on standard prior authorizations",
                hint: "Of the total standard prior authorization requests, as reported in D1.XIII.3, enter the median number of days that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 2,
              },
            },
            {
              id: "plan_percentageOfExpeditedPriorAuthorizationRequestsApproved",
              type: "number",
              validation: "number",
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
              type: "number",
              validation: "number",
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
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.13 Average time to decision for expedited prior authorizations",
                hint: "Of the total expedited prior authorization requests, as reported in D1.XIII.4, enter the average number of hours that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 2,
              },
            },
            {
              id: "plan_medianTimeToDecisionOnExpeditedPriorAuthorizationRequests",
              type: "number",
              validation: "number",
              props: {
                label:
                  "D1.XIII.14 Median time to decision for expedited prior authorizations",
                hint: "Of the total expedited prior authorization requests, as reported in D1.XIII.4, enter the median number of hours that elapsed between submission of request and decision by the plan. If you choose not to respond prior to June 2026, enter “NR” for not reporting.",
                decimalPlacesToRoundTo: 2,
              },
            },
            {
              id: "plan_percentageOfTotalPriorAuthorizationRequestsApprovedWithExtendedTimeframe",
              type: "number",
              validation: "number",
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
      },
    ],
  },
];

describe("deletePlanData", () => {
  const result = deletePlanData(mockPlanData, priorAuthorizationFields);
  it("should remove all prior authorization data from the plan, leaving only the plan ID", () => {
    expect(result.length).toBe(1);
    expect(result[0]).toStrictEqual({ id: "mock-id" });
  });
  it("should", () => {
    const result = getFieldsToFilter(
      mockPlanLevelIndicators,
      "plan_priorAuthorizationReporting"
    );
    expect(result.length).toBe(15);
    expect(result).toEqual(priorAuthorizationFields);
  });
});
