// types
import { EntityShape, EntityType, ReportShape } from "types";

export const getNaaarEntityStatus = (
  entity: EntityShape,
  report: ReportShape,
  entityType?: EntityType
) => {
  if (entityType === "plans") {
    return !!(
      entity?.planCompliance438206_assurance &&
      entity?.planCompliance43868_assurance
    );
  }
  return false;
};
