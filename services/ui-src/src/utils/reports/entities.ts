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

export const getFormattedEntityData = (
  entityType: string,
  entity?: EntityShape
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
      };
      break;

    default:
  }
  return entityData;
};
