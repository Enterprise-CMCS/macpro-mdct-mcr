// types
import { EntityShape, EntityType, ReportShape } from "types";

// TODO: Update to actual logic
export const getNaaarEntityStatus = (
  report: ReportShape,
  entity: EntityShape,
  entityType?: EntityType
) => {
  if (entityType === "plans") {
    return !!(
      entity.planCompliance438206_assurance &&
      entity.planCompliance43868_assurance
    );
  }
  return false;
};
