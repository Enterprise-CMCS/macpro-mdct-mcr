// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
import { FormJson } from "types";

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

export const exceptionsNonComplianceStatus = (
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string,
  entityId: string
) => {
  const complianceKeyPrefix = `${standardKeyPrefix}-${entityId}-`;
  const exceptionOrNonCompliance = exceptionsNonCompliance.find((key) =>
    key.startsWith(complianceKeyPrefix)
  );
  if (!exceptionOrNonCompliance) return;

  if (exceptionOrNonCompliance.includes("exceptions")) {
    return exceptionsStatus;
  }
  return nonComplianceStatus;
};

export const addExceptionsNonComplianceStatus = (
  entities: NaaarStandardsTableShape[],
  exceptionsNonCompliance: string[],
  standardKeyPrefix: string
) =>
  entities.map((entity) => {
    const exceptionsOrNonCompliance = exceptionsNonComplianceStatus(
      exceptionsNonCompliance,
      standardKeyPrefix,
      entity.entity.id
    );

    return {
      ...entity,
      exceptionsNonCompliance: exceptionsOrNonCompliance,
    };
  });
