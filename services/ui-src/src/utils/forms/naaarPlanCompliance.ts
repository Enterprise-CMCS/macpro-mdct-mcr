// types
import { EntityShape, FormJson } from "types";

export const hasComplianceDetails = (
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string,
  entityId: string
) => {
  return exceptionsNonCompliance.some((key) => {
    const id = key.split(`${standardKeyPrefix}-`).pop();
    return id?.startsWith(entityId);
  });
};

export const filteredStandards = (
  analysisMethods: EntityShape[] = [],
  standards: EntityShape[] = [],
  selectedEntity?: EntityShape
) => {
  const analysisMethodsUsedByPlan = analysisMethods
    .filter((method: EntityShape) => {
      const plansUsingMethod =
        method.analysis_method_applicable_plans?.filter((plan: EntityShape) =>
          plan.key.endsWith(selectedEntity?.id)
        ) || [];

      if (plansUsingMethod.length > 0) {
        return method;
      }

      return;
    })
    .map((method: EntityShape) => method.id);

  const standardsUsedByPlan = standards.filter((standard: EntityShape) => {
    const key =
      Object.keys(standard).find((key) =>
        key.startsWith("standard_analysisMethodsUtilized-")
      ) || "";

    // Collect ids of standards in standard_analysisMethodsUtilized-*
    const analysisMethodsUsedByStandard =
      standard[key]?.map((method: EntityShape) =>
        method.key.split("-").pop()
      ) || [];
    const isAnalysisMethodUsedByStandardAndPlan =
      analysisMethodsUsedByStandard.some((method: string) =>
        analysisMethodsUsedByPlan.includes(method)
      );

    if (isAnalysisMethodUsedByStandardAndPlan) return standard;
    return;
  });

  return standardsUsedByPlan;
};

// TODO: Add analysis methods checkboxes used by standard
export const addAnalysisMethods = (formJson: FormJson) => {
  return formJson;
};

export const addStandardId = (
  form: FormJson,
  standardPrefix: string,
  standardId: string
) => {
  const updatedForm = structuredClone(form);

  function needsStandardId(value: string) {
    if (typeof value !== "string") return false;

    return value.startsWith(standardPrefix) && !value.includes(standardId);
  }

  function updateRecursively(obj: any) {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];

        if (Array.isArray(value)) {
          value.forEach(updateRecursively);
        } else if (typeof value === "object") {
          updateRecursively(value);
        } else if (needsStandardId(value)) {
          const option = value.includes("-")
            ? value.split("-").pop()
            : undefined;
          obj[key] = [standardPrefix, standardId, option]
            .filter((f) => f)
            .join("-");
        }
      });
    }
  }

  updateRecursively(updatedForm);
  return updatedForm;
};
