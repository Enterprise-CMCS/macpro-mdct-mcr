// types
import {
  EntityShape,
  EntityType,
  ModalOverlayReportPageShape,
  ReportShape,
} from "types";
// utils
import { calculateIsEntityCompleted } from "./entityRows";

export const getMcparEntityStatus = (
  entity: EntityShape,
  report: ReportShape,
  entityType: EntityType,
  route: ModalOverlayReportPageShape
) => {
  const plans = report?.fieldData?.plans;
  const planForm = route?.drawerForm;
  if (entityType === EntityType.QUALITY_MEASURES && plans && planForm) {
    for (const plan of plans) {
      const isPlanComplete = calculateIsEntityCompleted({
        entity: plan,
        form: planForm,
        isMeasuresAndResultsPage: true,
        isCustomEntity: false,
        measureId: entity.id,
      });
      if (!isPlanComplete) {
        return false;
      }
    }
    return true;
  }
  return false;
};
