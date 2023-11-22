import { EntityShape } from "types";

// return MLR eligibility group text
export const eligibilityGroup = (entity: EntityShape) => {
  if (entity["report_eligibilityGroup-otherText"]) {
    return entity["report_eligibilityGroup-otherText"];
  }
  return entity.report_eligibilityGroup[0].value;
};
