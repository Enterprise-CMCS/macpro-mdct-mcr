// types
import { AnyObject } from "types";

export const deletePlanData = (
  planData: AnyObject,
  priorAuthorizationFields: string[]
) => {
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
