// types
import { AnyObject } from "types";

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

export const deletePlanData = (planData: AnyObject) => {
  // delete Prior Authorization plan data if selecting "Not reporting data"
  const filteredPlanData = planData?.map((plan: AnyObject) => {
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
