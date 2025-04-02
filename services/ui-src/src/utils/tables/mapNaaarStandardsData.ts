// types
import { EntityShape } from "types";
// utils
import { compareText, otherSpecify } from "utils";

export const mapNaaarStandardEntity = (entity: EntityShape, index?: number) => {
  const [provider, standardType, population, region] = [
    "standard_coreProviderTypeCoveredByStandard",
    "standard_standardType",
    "standard_populationCoveredByStandard",
    "standard_applicableRegion",
  ].map((key: string) => {
    const parentObj = entity[key] || [];
    const value = parentObj[0]?.value;
    let otherText = entity[`${key}-otherText`];

    if (key === "standard_coreProviderTypeCoveredByStandard") {
      const providerKey = parentObj[0].key;
      const providerId = providerKey
        .split("standard_coreProviderTypeCoveredByStandard-")
        .pop();
      otherText = entity[`${key}-${providerId}-otherText`];

      const matchText = `${value}; ${otherText}`;

      return compareText(true, !!otherText, matchText, value);
    }

    return otherSpecify(value, otherText);
  });

  // extract the standard description attribute
  const standardDescriptionKey =
    Object.keys(entity).find((key) => {
      return key.startsWith("standard_standardDescription-");
    }) || "";
  const description = entity[standardDescriptionKey];
  // extract corresponding standard choice id
  const standardId = standardDescriptionKey
    .split("standard_standardDescription-")
    .pop();
  // use the id to extract analysis method attribute
  const analysisMethodsUtilized =
    entity[`standard_analysisMethodsUtilized-${standardId}`];
  // there are 7 analysis methods checkboxes
  const analysisMethods = analysisMethodsUtilized
    ?.map((method: { key: string; value: string }) => method.value)
    .join(", ");

  return {
    count: index === undefined ? undefined : index + 1,
    provider,
    standardType,
    description,
    analysisMethods,
    population,
    region,
    entity,
  };
};

export const mapNaaarStandardsData = (entities: EntityShape[]) =>
  entities.map((entity, index) => mapNaaarStandardEntity(entity, index));
