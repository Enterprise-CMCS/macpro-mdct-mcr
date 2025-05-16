// types
import { EntityShape, EntityType, ReportShape } from "types";
// utils
import { isPlanComplete } from "utils";

export const getNaaarEntityStatus = (
  entity: EntityShape,
  report: ReportShape,
  entityType?: EntityType
) => {
  if (entityType === EntityType.PLANS) {
    return isPlanComplete(entity);
  }
  return false;
};
