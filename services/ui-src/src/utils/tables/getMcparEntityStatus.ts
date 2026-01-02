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

  // Filter out plans that are exempted from quality measures

  // Extract plan IDs from the key field (format: "plansExemptFromQualityMeasures-{planId}")
  const exemptedPlanIds =
    report.fieldData?.plansExemptFromQualityMeasures?.map(
      (exemption: EntityShape) =>
        exemption.key?.replace("plansExemptFromQualityMeasures-", "")
    ) || [];

  const filteredPlans = plans.filter(
    (plan: EntityShape) => !exemptedPlanIds.includes(plan.id)
  );

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
