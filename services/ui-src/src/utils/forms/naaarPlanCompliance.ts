// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { NaaarStandardsTableShape } from "components/tables/SortableNaaarStandardsTable";
import { AnyObject, FormJson } from "types";
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
  entityId: string,
  standards: any,
  createdAnalysisMethods: any,
  selectedEntityName: string | undefined
) => {
  //First we'll create a copy of the form to make future changes too.
  const updatedForm = structuredClone(form);

  //Step 1: Grab all the Plans associated with the selected Analysis Methods
  /*
   * This is going to grab all of the Analysis Methods associated with the plan as selected on
   * Part 1: State and program information, Analysis Methods.
   * Returns an array that looks like ['Geomapping', 'Plan Provider Directory Review', 'Secret Shopper: Network Participation']
   */
  const associatedAnalysisMethodsWithSelectedPlan =
    createdAnalysisMethods.flatMap((analysisMethod: any) => {
      if (!analysisMethod?.analysis_method_applicable_plans) return [];
      const methodName = analysisMethod.name;
      for (let method of analysisMethod.analysis_method_applicable_plans) {
        if (method.value == selectedEntityName) {
          return methodName;
        }
      }
      return [];
    });

  //Step 2: Grab all the Plans associated with the selected Standard
  /*
   * This is going to grab all of the Analysis Methods associated with the standard as selected on
   * Part 2: Program-level access and network adequacy standards.
   * Creates an array that looks like ['Geomapping', 'Plan Provider Directory Review']
   */
  const utilizedAnalysisMethodsWithSelectedStandard = standards.flatMap(
    (item: { [x: string]: any[] }) => {
      const analysisMethodsKey = Object.keys(item).find((key) =>
        key.startsWith("standard_analysisMethodsUtilized-")
      );
      if (analysisMethodsKey) {
        return item[analysisMethodsKey].map(
          (analysisMethod) => analysisMethod.value
        );
      }
      return [];
    }
  );

  //Step 3, Grab the interesection of Analysis Methods associated with Plans and Standards
  /*
   * Compares the Analysis methods in the plan and the standard, and grabs the ones associated with both
   * For example, given the array examples above it would return ['Geomapping', 'Plan Provider Directory Review']
   * Since both those analysis methods are in both the plan and the standard.
   */
  const associatedMethodsBetweenStandardsAndPlan =
    associatedAnalysisMethodsWithSelectedPlan.filter((value: any) =>
      utilizedAnalysisMethodsWithSelectedStandard.includes(value)
    );

  //Step 4, Go through and find any associated questions relating to the analysis methods and inject those choices into the form.
  /*
   * This will inject the array of choices from Step 3 into Part 3. Plan compliance. Specifically, it will
   * find the checkbox for "Standard is non-compliant for this plan", and if checked, show step 3's answers in the question
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
        value === `${standardKeyPrefix}-${entityId}-nonComplianceAnalyses`
      ) {
        obj.props.choices = availableAnalysisMethods(
          obj.id,
          associatedMethodsBetweenStandardsAndPlan
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
