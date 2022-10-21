// utils
import { AnyObject, EntityShape, ModalDrawerEntityTypes } from "types";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label]?.[0].value !== "Other, specify"
    ? entity?.[label]?.[0].value
    : entity?.[label + "-otherText"];
};

const getCheckboxValues = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label]?.map((method: AnyObject) =>
    method.value === "Other, specify"
      ? entity?.[label + "-otherText"]
      : method.value
  );
};

const getReportingRateType = (entity: EntityShape | undefined) => {
  return entity?.qualityMeasure_reportingRateType?.[0]?.value ===
    "Cross-program rate"
    ? "Cross-program rate: " +
        entity?.qualityMeasure_crossProgramReportingRateProgramList
    : entity?.qualityMeasure_reportingRateType?.[0]?.value;
};

const getReportingPeriod = (entity: EntityShape | undefined) => {
  return entity?.qualityMeasure_reportingPeriod?.[0]?.value === "No"
    ? `${entity?.qualityMeasure_reportingPeriodStartDate} - ${entity?.qualityMeasure_reportingPeriodEndDate}`
    : entity?.qualityMeasure_reportingPeriod?.[0]?.value;
};

// returns an array of { planName: string, response: string } or undefined
export const getPlanValues = (entity?: EntityShape, plans?: AnyObject[]) =>
  plans?.map((plan: AnyObject) => ({
    name: plan.name,
    response: entity?.[`qualityMeasure_plan_measureResults_${plan.id}`],
  }));

export const getFormattedEntityData = (
  entityType: string,
  entity?: EntityShape,
  reportFieldData?: AnyObject
) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return {
        category: entity?.accessMeasure_generalCategory[0].value,
        standardDescription: entity?.accessMeasure_standardDescription,
        standardType: getRadioValue(entity, "accessMeasure_standardType"),
        provider: getRadioValue(entity, "accessMeasure_providerType"),
        region: getRadioValue(entity, "accessMeasure_applicableRegion"),
        population: getRadioValue(entity, "accessMeasure_population"),
        monitoringMethods: getCheckboxValues(
          entity,
          "accessMeasure_monitoringMethods"
        ),
        methodFrequency: getRadioValue(
          entity,
          "accessMeasure_oversightMethodFrequency"
        ),
      };
    case ModalDrawerEntityTypes.SANCTIONS:
      return {
        interventionType: getRadioValue(entity, "sanction_interventionType"),
        interventionTopic: getRadioValue(entity, "sanction_interventionTopic"),
        planName: reportFieldData?.plans?.find(
          (plan: any) => plan.id === entity?.sanction_planName.value
        )?.name,
        interventionReason: entity?.sanction_interventionReason,
        noncomplianceInstances: entity?.sanction_noncomplianceInstances,
        dollarAmount: entity?.sanction_dollarAmount,
        assessmentDate: entity?.sanction_assessmentDate,
        remediationDate: entity?.sanction_remediationDate,
        correctiveActionPlan: getRadioValue(
          entity,
          "sanction_correctiveActionPlan"
        ),
      };
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return {
        domain: getRadioValue(entity, "qualityMeasure_domain"),
        name: entity?.qualityMeasure_name,
        nqfNumber: entity?.qualityMeasure_nqfNumber,
        reportingRateType: getReportingRateType(entity),
        set: getRadioValue(entity, "qualityMeasure_set"),
        reportingPeriod: getReportingPeriod(entity),
        description: entity?.qualityMeasure_description,
        perPlanResponses: getPlanValues(entity, reportFieldData?.plans),
      };
    default:
      return {};
  }
};
