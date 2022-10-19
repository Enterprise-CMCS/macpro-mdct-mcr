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

const getPlans = (entity: EntityShape, reportFieldData?: AnyObject) => {
  // Check the entity to see how many plans are associated with the measure
  const foundPlans = Object.keys(entity).filter((key) =>
    key.includes("qualityMeasure_plan_measureResults")
  );
  let convertedPlans: any = [];

  // Loop through all the plans that are found tied to the measure
  for (let foundPlan of foundPlans) {
    // We have the value already tied in from the users input on the field
    const accessMeasureValue = entity[foundPlan];

    /*
     * We need the name of the plan however, and we're only given the ID at the end of the key.
     * That means we need to look up in the reportFieldData for a matching key to know the plan name
     */
    const planName = reportFieldData?.plans?.find(
      (plan: any) =>
        plan.id === foundPlan.replace("qualityMeasure_plan_measureResults_", "")
    )?.name;

    /*
     * If we know the plan name and the value the user inputted for the access measure associated
     * with the plan, then we can tie it together and add it to the list to return
     */
    if (planName && accessMeasureValue) {
      const formattedAccessMeasure = {
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
        category: entity?.qualityMeasure_name,
        description: entity?.qualityMeasure_description,
        domain: getRadioValue(entity, "qualityMeasure_domain"),
        nqfNumber: entity?.qualityMeasure_nqfNumber,
        reportingPeriod: getRadioValue(
          entity,
          "qualityMeasure_reportingPeriod"
        ),
        reportingRateType: getRadioValue(
          entity,
          "qualityMeasure_reportingRateType"
        ),
        set: getRadioValue(entity, "qualityMeasure_set"),
        numberOfPlans: reportFieldData?.plans.length,
      };
      if (entity) entityData.plans = getPlans(entity, reportFieldData);
      break;

    default:
  }
  return entityData;
};
