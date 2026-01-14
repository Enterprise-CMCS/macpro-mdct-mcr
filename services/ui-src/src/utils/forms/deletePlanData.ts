// types
import { AnyObject } from "types";

export const getFieldsToFilter = (
  planLevelIndicators: AnyObject,
  reportingOn: string
) => {
  let fields: string[] = [];
  switch (reportingOn) {
    case "plan_priorAuthorizationReporting": {
      // get prior authorization field ids from form template
      const priorAuthorizationRoute = planLevelIndicators?.[0].children?.filter(
        (child: any) =>
          child.path === "/mcpar/plan-level-indicators/prior-authorization"
      );
      fields = priorAuthorizationRoute?.[0].drawerForm.fields.map(
        (field: any) => {
          return field.id;
        }
      );
      break;
    }
    case "plan_patientAccessApiReporting": {
      // get patient access api field ids from form template
      const patientAccessApiRoute = planLevelIndicators?.[0].children?.filter(
        (child: any) =>
          child.path === "/mcpar/plan-level-indicators/patient-access-api"
      );
      fields = patientAccessApiRoute?.[0].drawerForm.fields.map(
        (field: any) => {
          return field.id;
        }
      );
      break;
    }
  }
  return fields;
};

export const deletePlanData = (
  planData: AnyObject,
  fieldsToFilter: string[]
) => {
  // delete relevant plan data if selecting "Not reporting data"
  const filteredPlanData = planData?.map((plan: AnyObject) => {
    let planKeys = Object.keys(plan);
    for (let i = 0; i < fieldsToFilter.length; i++) {
      for (let j = 0; j < planKeys.length; j++) {
        if (planKeys[j].startsWith(fieldsToFilter[i])) {
          delete plan[planKeys[j]];
        }
      }
    }
    return plan;
  });
  return filteredPlanData;
};
