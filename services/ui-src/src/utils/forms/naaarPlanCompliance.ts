// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
import { AnyObject, FormJson } from "types";

export const hasComplianceDetails = (
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string,
  entityId: string
) => {
  return !!exceptionsNonComplianceStatus(
    exceptionsNonCompliance,
    standardKeyPrefix,
    entityId
  );
};

// TODO: Add analysis methods checkboxes used by standard
export const addAnalysisMethods = (form: FormJson, standards: any) => {
  // analysis methods that are applicable, by plan
  const updatedForm = structuredClone(form);
  let analysisMethodsInPlan: AnyObject[] = [];
  standards
    .map((item: { [x: string]: any[] }) => {
      const analysisMethodsKey = Object.keys(item).find((key) =>
        key.startsWith("standard_analysisMethodsUtilized-")
      );
      if (analysisMethodsKey) {
        return item[analysisMethodsKey].map(
          (analysisMethod) => analysisMethod.value
        );
      }

      return analysisMethodsInPlan;
    })
    .flat();
  // return updatedForm
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

  function updateRecursively(obj: AnyObject) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (Array.isArray(value)) {
        value.forEach(updateRecursively);
      } else if (typeof value === "object") {
        updateRecursively(value);
      } else if (needsStandardId(value)) {
        const option = value.includes("-") ? value.split("-").pop() : undefined;
        obj[key] = [standardPrefix, standardId, option]
          .filter((f) => f)
          .join("-");
      }
    });
  }

  updateRecursively(updatedForm);
  return updatedForm;
};

export const exceptionsNonComplianceStatus = (
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string,
  entityId: string
) => {
  const complianceKeyPrefix = `${standardKeyPrefix}-${entityId}-`;
  const exceptionOrNonCompliance =
    exceptionsNonCompliance.find((key) =>
      key.startsWith(complianceKeyPrefix)
    ) || "";

  if (exceptionOrNonCompliance.includes("exceptions")) {
    return exceptionsStatus;
  } else if (exceptionOrNonCompliance.includes("nonCompliance")) {
    return nonComplianceStatus;
  }
  return;
};

export const addExceptionsNonComplianceStatus = (
  standards: NaaarStandardsTableShape[],
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string
) =>
  standards.map((standard) => {
    const exceptionsOrNonCompliance = exceptionsNonComplianceStatus(
      exceptionsNonCompliance,
      standardKeyPrefix,
      standard.entity.id
    );

    return {
      ...standard,
      exceptionsNonCompliance: exceptionsOrNonCompliance,
    };
  });
