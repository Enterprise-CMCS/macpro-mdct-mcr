// types
import {
  EntityShape,
  EntityType,
  ModalOverlayReportPageShape,
  ReportShape,
} from "types";
// utils
import { calculateIsEntityCompleted } from "./entityRows";
import { getPlansNotExemptFromQualityMeasures } from "../reports/entities.plans";

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

  const filteredPlans = getPlansNotExemptFromQualityMeasures(report);

  // If all plans are exempted, return true (nothing to complete)
  if (filteredPlans.length === 0) return true;

  return filteredPlans.every((plan: EntityShape) =>
    calculateIsEntityCompleted({
      entity: plan,
      form: planForm,
      isMeasuresAndResultsPage: true,
      measureId: entity.id,
    })
  );
};
