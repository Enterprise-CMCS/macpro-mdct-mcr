import { EntityShape, ReportShape, ReportType } from "types";
import { getMlrEntityStatus, getNaaarEntityStatus } from "utils";

export const getEntityStatus = (
  report?: ReportShape,
  entity?: EntityShape,
  entityType?: string
) => {
  if (!report || !entity) {
    return false;
  }

  switch (report.reportType) {
    case ReportType.MLR:
      return getMlrEntityStatus(report, entity);
    case ReportType.NAAAR:
      return getNaaarEntityStatus(report, entity, entityType);
    default:
      return false;
  }
};
