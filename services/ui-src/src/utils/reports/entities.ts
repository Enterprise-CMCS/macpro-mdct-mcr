// utils
import { AnyObject, EntityShape, ModalDrawerEntityTypes } from "types";

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
        standardType:
          entity?.accessMeasure_standardType[0].value !== "Other, specify"
            ? entity?.accessMeasure_standardType[0].value
            : entity?.["accessMeasure_standardType-otherText"],
        provider:
          entity?.accessMeasure_providerType?.[0].value !== "Other, specify"
            ? entity?.accessMeasure_providerType?.[0].value
            : entity?.["accessMeasure_providerType-otherText"],
        region:
          entity?.accessMeasure_applicableRegion?.[0].value !== "Other, specify"
            ? entity?.accessMeasure_applicableRegion?.[0].value
            : entity?.["accessMeasure_applicableRegion-otherText"],
        population:
          entity?.accessMeasure_population?.[0].value !== "Other, specify"
            ? entity?.accessMeasure_population?.[0].value
            : entity?.["accessMeasure_population-otherText"],
        monitoringMethods: entity?.accessMeasure_monitoringMethods?.map(
          (method: AnyObject) =>
            method.value === "Other, specify"
              ? entity?.["accessMeasure_monitoringMethods-otherText"]
              : method.value
        ),
        methodFrequency:
          entity?.accessMeasure_oversightMethodFrequency?.[0].value !==
          "Other, specify"
            ? entity?.accessMeasure_oversightMethodFrequency?.[0].value
            : entity?.["accessMeasure_oversightMethodFrequency-otherText"],
      };
      break;

    case ModalDrawerEntityTypes.SANCTIONS:
      break;

    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      break;

    default:
  }
  return entityData;
};
