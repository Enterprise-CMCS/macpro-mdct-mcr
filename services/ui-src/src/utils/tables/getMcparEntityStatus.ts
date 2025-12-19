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
  if (entityType !== EntityType.QUALITY_MEASURES || !plans || !planForm)
    return false;

  return plans.every((plan: EntityShape) =>
    calculateIsEntityCompleted({
      entity: plan,
      form: planForm,
      isMeasuresAndResultsPage: true,
      measureId: entity.id,
    })
  );
};
