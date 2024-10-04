// types
import { AnyObject } from "types";

const priorAuthorizationFields = [
  "plan_totalNumberOfStandardPARequests",
  "plan_totalNumberOfExpeditedPARequests",
  "plan_totalNumberOfStandardAndExpeditedPARequests",
  "plan_percentageOfStandardPARequestsApproved",
  "plan_percentageOfStandardPARequestsDenied",
  "plan_percentageOfStandardPARequestsApprovedAfterAppeal",
  "plan_averageTimeElapsedBetweenSubmissionOfRequestAndDeterminationForStandardPAs",
  "plan_medianTimeElapsedBetweenSubmissionOfRequestAndDeterminationForStandardPAs",
  "plan_percentageOfExpeditedPARequestsApproved",
  "plan_percentageOfExpeditedPARequestsDenied",
  "plan_averageTimeElapsedBetweenSubmissionOfRequestAndDeterminationForExpeditedPAs",
  "plan_medianTimeElapsedBetweenSubmissionOfRequestAndDeterminationForExpeditedPAs",
  "plan_percentageOfPARequestsExtendedReviewTimeframeAndApproved",
];

export const deletePlanData = (planData: AnyObject) => {
  // delete Prior Authorization plan data if selecting "Not reporting data"
  const filteredPlanData = planData.map((plan: AnyObject) => {
    let planKeys = Object.keys(plan);
    for (let i = 0; i < priorAuthorizationFields.length; i++) {
      for (let j = 0; j < planKeys.length; j++) {
        if (planKeys[j].startsWith(priorAuthorizationFields[i])) {
          delete plan[planKeys[j]];
        }
      }
    }
    return plan;
  });
  return filteredPlanData;
};
