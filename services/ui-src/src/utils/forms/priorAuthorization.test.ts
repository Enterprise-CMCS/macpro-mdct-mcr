import { deletePlanData } from "./priorAuthorization";
import { describe, expect, it } from "vitest";

const mockPlanData = [
  {
    id: "mock-id",
    plan_totalNumberOfStandardPARequests: 1,
    plan_totalNumberOfExpeditedPARequests: 2,
    plan_totalNumberOfStandardAndExpeditedPARequests: 3,
    plan_percentageOfStandardPARequestsApproved: "1%",
    plan_percentageOfStandardPARequestsDenied: "5%",
    plan_percentageOfStandardPARequestsApprovedAfterAppeal: "43%",
    plan_averageTimeElapsedBetweenSubmissionOfRequestAndDeterminationForStandardPAs:
      { key: "mock-key-1", value: "24" },
    plan_medianTimeElapsedBetweenSubmissionOfRequestAndDeterminationForStandardPAs:
      { key: "mock-key-2", value: "132" },
    plan_percentageOfExpeditedPARequestsApproved: "0%",
    plan_percentageOfExpeditedPARequestsDenied: "100%",
    plan_averageTimeElapsedBetweenSubmissionOfRequestAndDeterminationForExpeditedPAs:
      { key: "mock-key-3", value: "57" },
    plan_medianTimeElapsedBetweenSubmissionOfRequestAndDeterminationForExpeditedPAs:
      { key: "mock-key-4", value: "24" },
    plan_percentageOfPARequestsExtendedReviewTimeframeAndApproved: "50%",
  },
];

describe("deletePlanData", () => {
  const result = deletePlanData(mockPlanData);
  it("should remove all prior authorization data from the plan, leaving only the plan ID", () => {
    expect(result.length).toBe(1);
    expect(result[0]).toStrictEqual({ id: "mock-id" });
  });
});
