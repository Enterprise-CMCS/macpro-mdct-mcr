// utils
import {
  AccessMeasureAssociatedPlan,
  AnyObject,
  EntityShape,
  ModalDrawerEntityTypes,
} from "types";

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

const getPlans = (entity: EntityShape, reportFieldData?: AnyObject) => {
  // Check the entity to see how many plans are associated with the measure
  const qualityMeasurePlanIdentifier = "qualityMeasure_plan_measureResults_";
  const foundPlans = Object.keys(entity).filter((key) =>
    key.includes(qualityMeasurePlanIdentifier)
  );
  let convertedPlans: AccessMeasureAssociatedPlan[] = [];

  // Loop through all the plans that are found tied to the measure
  for (let foundPlan of foundPlans) {
    // We have the value already tied in from the users input on the field
    const accessMeasureValue: string = entity[foundPlan];
    /*
     * We need the name of the plan however, and we're only given the ID at the end of the key.
     * That means we need to look up in the reportFieldData for a matching key to know the plan name
     */
    const planName: string = reportFieldData?.plans?.find(
      (plan: AnyObject) =>
        plan.id === foundPlan.replace(qualityMeasurePlanIdentifier, "")
    )?.name;

    /*
     * If we know the plan name and the value the user inputted for the access measure associated
     * with the plan, then we can tie it together and add it to the list to return
     */
    if (planName && accessMeasureValue) {
      const formattedAccessMeasure: AccessMeasureAssociatedPlan = {
        name: planName,
        value: accessMeasureValue,
      };
      convertedPlans.push(formattedAccessMeasure);
    }
  }
  return convertedPlans;
};

export const getFormattedEntityData = (
  entityType: string,
  entity?: EntityShape,
  reportFieldData?: AnyObject
) => {
  let entityData: any = {};
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      entityData = {
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
      break;

    case ModalDrawerEntityTypes.SANCTIONS:
      entityData = {
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
      break;

    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      entityData = {
        domain: getRadioValue(entity, "qualityMeasure_domain"),
        name: entity?.qualityMeasure_name,
        nqfNumber: entity?.qualityMeasure_nqfNumber,
        reportingRateType: getReportingRateType(entity),
        set: getRadioValue(entity, "qualityMeasure_set"),
        reportingPeriod: getReportingPeriod(entity),
        description: entity?.qualityMeasure_description,
        numberOfPlans: reportFieldData?.plans.length,
        plans: entity ? getPlans(entity, reportFieldData) : undefined,
      };
      break;

    default:
  }
  return entityData;
};
