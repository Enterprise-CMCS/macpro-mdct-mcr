import { EntityShape, ReportShape, ReportType } from "types";
import { getMlrEntityStatus, getNaaarEntityStatus } from "utils";

export const getEntityStatus = (report?: ReportShape, entity?: EntityShape) => {
  if (!report || !entity) {
    return false;
  }

  switch (report.reportType) {
    case ReportType.MLR:
      return getMlrEntityStatus(report, entity);
    case ReportType.NAAAR:
      // TODO: refactor to handle NAAAR analysis methods
      return getNaaarEntityStatus();
    default:
      return false;
  }
};
