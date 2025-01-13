import { EntityShape } from "types";

// if reporting on ILOS, verify that its questions are completed
export const isIlosCompleted = (
  reportingOnIlos: boolean,
  entity: EntityShape
) => {
  let isIlosCompleted = false;
  if (
    (reportingOnIlos && entity["plan_ilosOfferedByPlan"]?.length > 0) ||
    entity["plan_ilosUtilizationByPlan"]
  ) {
    isIlosCompleted = entity["plan_ilosOfferedByPlan"][0].value.startsWith(
      "Yes"
    )
      ? entity["plan_ilosUtilizationByPlan"].length > 0
      : entity["plan_ilosOfferedByPlan"][0];
  }

  return isIlosCompleted;
};
