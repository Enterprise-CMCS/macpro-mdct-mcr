// types
import { EntityShape, EntityType, ReportShape, ReportType } from "types";
// utils
import { getMlrEntityStatus, getNaaarEntityStatus } from "utils";

export const getEntityStatus = (
  entity: EntityShape,
  report?: ReportShape,
  entityType?: EntityType
) => {
  switch (report?.reportType) {
    case ReportType.MLR:
      return getMlrEntityStatus(entity, report);
    case ReportType.NAAAR:
      return getNaaarEntityStatus(entity, report, entityType);
    default:
      return false;
  }
};
