// constants
import {
  exceptionsStatus,
  nonComplianceStatus,
  nonCompliantValues,
  planComplianceStandardKey,
} from "../../constants";
// types
import {
  AnyObject,
  EntityShape,
  FormJson,
  NaaarStandardsTableShape,
} from "types";
import { availableAnalysisMethods } from "./dynamicItemFields";

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

// Add analysis methods checkboxes used by standard
export const addAnalysisMethods = (
  form: FormJson,
  standardKeyPrefix: string,
  selectedStandard: EntityShape,
  createdAnalysisMethods: {
    analysis_method_applicable_plans: AnyObject[];
    name: string;
  }[],
  selectedPlanName?: string
) => {
  // First we'll create a copy of the form to make future changes to
  const updatedForm = structuredClone(form);

  // Step 1: Grab all the Analysis Methods associated with the selected Plan
  /*
   * This is going to grab all of the Analysis Methods associated with the Plan as selected in
   * Part 1: State and program information, D. Analysis Methods
   * [
   * {
   *    "id": "mockUUID123",
   *    "name": "Geomapping"
   * },
   * {
   *    "id": "mockUUID456",
   *     "name": "Plan Provider Directory Review"
   * },
   * ]
   */
  const associatedAnalysisMethodsWithSelectedPlan: AnyObject[] =
    createdAnalysisMethods?.map((analysisMethod: AnyObject) => {
      if (!analysisMethod?.analysis_method_applicable_plans) return [];
      for (const method of analysisMethod.analysis_method_applicable_plans) {
        if (method.value == selectedPlanName) {
          return {
            id: analysisMethod.id,
            name:
              analysisMethod.custom_analysis_method_name ?? analysisMethod.name,
          };
        }
      }
      return [];
    });

  // Step 2: Grab all the Analysis Methods associated with the selected Standard
  /*
   * This is going to grab all of the Analysis Methods associated with the Standard as selected in
   * Part 2: Program-level access and network adequacy standards
   * [
   * {
   * "key": "standard_analysisMethodsUtilized-standardId-mockUUID123",
   * "value": "Geomapping"
   * }
   * ]
   */
  let utilizedAnalysisMethodsWithSelectedStandard: AnyObject[] = [];
  const analysisMethodsKey = Object.keys(selectedStandard).find((key) =>
    key.startsWith("standard_analysisMethodsUtilized-")
  );
  if (analysisMethodsKey) {
    utilizedAnalysisMethodsWithSelectedStandard =
      selectedStandard[analysisMethodsKey];
  }

  // Step 3: Grab the intersection of Analysis Methods associated with Plans and Standards
  /*
   * Compares the Analysis Methods in the Plan and the Standard and grabs the ones associated with both
   * For example, given the array examples above it would return
   * [
   * {
   *    "id": "mockUUID123",
   *     "name": "Geomapping"
   * },
   * ]
   * Since Geomapping is an Analysis Method in both the Plan and the Standard
   */
  const associatedMethodsBetweenStandardsAndPlan =
    associatedAnalysisMethodsWithSelectedPlan?.filter((plan) =>
      utilizedAnalysisMethodsWithSelectedStandard?.some((standard) =>
        standard?.key?.endsWith(plan.id)
      )
    );

  // Step 4: Go through and find any associated questions relating to the Analysis Methods and inject those choices into the form
  /*
   * This will inject the array of choices from Step 3 into Part 3. Plan compliance. Specifically, it will
   * find the checkbox for "Standard is non-compliant for this plan", and if checked, show Step 3's answers in the question
   * "Plan deficiencies: 42 C.F.R. § 438.68 analyses used to identify deficiencies"
   */
  function findAndInjectMethodsIntoForm(obj: AnyObject) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];

      if (Array.isArray(value)) {
        value.forEach(findAndInjectMethodsIntoForm);
      } else if (typeof value === "object") {
        findAndInjectMethodsIntoForm(value);
      } else if (
        value ===
        `${standardKeyPrefix}-${selectedStandard.id}-nonComplianceAnalyses`
      ) {
        // creating and injecting the analysis method choices into the form
        obj.props.choices = availableAnalysisMethods(
          obj.id,
          associatedMethodsBetweenStandardsAndPlan,
          obj.props.choices
        );
      }
    });
  }

  findAndInjectMethodsIntoForm(updatedForm);
  return updatedForm;
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

export const getExceptionsNonComplianceKeys = (
  selectedEntity: EntityShape,
  keyPrefix: string = `${planComplianceStandardKey}-`
) => {
  return Object.keys(selectedEntity).filter(
    (key) => key.startsWith(keyPrefix) && selectedEntity[key] !== undefined
  );
};

export const getExceptionsNonComplianceCounts = (
  exceptionsNonComplianceKeys: string[]
) => {
  return exceptionsNonComplianceKeys.reduce(
    (obj, key) => {
      if (key.endsWith("exceptionsDescription")) {
        obj.exceptionsCount++;
      } else if (key.endsWith("nonComplianceDescription")) {
        obj.nonComplianceCount++;
      }
      return obj;
    },
    { exceptionsCount: 0, nonComplianceCount: 0 }
  );
};

export const isComplianceFormComplete = (
  entity: EntityShape,
  formId: string
) => {
  const assuranceField = entity[`${formId}_assurance`];
  // Form is complete if compliance answer is Yes
  if (assuranceField && !nonCompliantValues.has(assuranceField[0]?.value)) {
    return true;
  }

  if (formId === "planCompliance43868") {
    const keys = getExceptionsNonComplianceKeys(entity);
    const counts = getExceptionsNonComplianceCounts(keys);
    const hasExceptionsOrNonCompliance = Object.values(counts).some(
      (count) => count > 0
    );

    return hasExceptionsOrNonCompliance;
  }

  if (formId === "planCompliance438206") {
    const keys = getExceptionsNonComplianceKeys(entity, formId);
    // Should have multiple compliance details
    return keys.length > 1;
  }

  return false;
};

export const isPlanComplete = (entity: EntityShape) => {
  const planKeys = ["planCompliance43868", "planCompliance438206"];
  return planKeys.every((planKey) => isComplianceFormComplete(entity, planKey));
};
