import { deletePlanData } from "./priorAuthorization";

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

describe("deletePlanData", () => {
  const result = deletePlanData(mockPlanData);
  it("should remove all prior authorization data from the plan, leaving only the plan ID", () => {
    expect(result.length).toBe(1);
    expect(result[0]).toStrictEqual({ id: "mock-id" });
  });
});
