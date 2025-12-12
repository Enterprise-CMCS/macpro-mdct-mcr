// types
import { AnyObject, ReportType } from "types";
import { FieldDataTuple } from "./autosave";
// utils
import { deletePlanData } from "utils";

export const dataModifications = (
  reportType: string = "",
  dataToWrite: AnyObject,
  reportFieldData: AnyObject = {}
) => {
  if (reportType === ReportType.MCPAR) {
    return updatePlansInExemptions(dataToWrite, reportFieldData);
  }
  if (reportType === ReportType.NAAAR) {
    return updatePlansInAnalysisMethods(dataToWrite, reportFieldData);
  }

  return dataToWrite;
};

export const handlePriorAuthorization = (
  dataToWrite: AnyObject,
  reportFieldData: AnyObject = {},
  fieldsToSave: FieldDataTuple[]
) => {
  // create field data object
  const fieldData = Object.fromEntries(fieldsToSave);
  let updatedDataToWrite = {
    ...dataToWrite,
    fieldData,
  };
  // handle Prior Authorization case
  let reportingOnPriorAuthorization: boolean = true;
  if (
    fieldsToSave[0][0] === "reportingDataPriorToJune2026" &&
    fieldsToSave[0][1][0].value !== "Yes"
  ) {
    reportingOnPriorAuthorization = false;
  }
  if (!reportingOnPriorAuthorization) {
    const filteredFieldData = deletePlanData(reportFieldData!["plans"]);
    updatedDataToWrite = {
      ...updatedDataToWrite,
      fieldData: { ...fieldData, plans: filteredFieldData },
    };
  }

  return updatedDataToWrite;
};

export const updatePlansInAnalysisMethods = (
  dataToWrite: AnyObject,
  reportFieldData: AnyObject = {}
) => {
  const field = "analysis_method_applicable_plans";
  const hasEditedPlans = dataToWrite.fieldData.plans;
  const hasAnalysisMethods =
    reportFieldData?.analysisMethods &&
    reportFieldData.analysisMethods.length > 0;

  if (hasEditedPlans && hasAnalysisMethods) {
    const plans = [...dataToWrite.fieldData.plans];
    const planNames = Object.fromEntries(
      plans.map((plan) => [`${field}-${plan.id}`, plan.name])
    );
    const analysisMethods = [...reportFieldData.analysisMethods];

    for (const analysisMethod of analysisMethods) {
      const applicablePlans = analysisMethod.analysis_method_applicable_plans;

      if (applicablePlans) {
        analysisMethod.analysis_method_applicable_plans = updatePlanNames(
          applicablePlans,
          planNames
        );
      }
    }

    return {
      ...dataToWrite,
      fieldData: {
        ...dataToWrite.fieldData,
        analysisMethods,
      },
    };
  }

  return dataToWrite;
};

export const updatePlansInExemptions = (
  dataToWrite: AnyObject,
  reportFieldData: AnyObject = {}
) => {
  const field = "plansExemptFromQualityMeasures";
  const hasEditedPlans = dataToWrite.fieldData.plans;
  const hasExemptPlans =
    reportFieldData?.plansExemptFromQualityMeasures &&
    reportFieldData.plansExemptFromQualityMeasures.length > 0;

  if (hasEditedPlans && hasExemptPlans) {
    const plans = [...dataToWrite.fieldData.plans];
    const planNames = Object.fromEntries(
      plans.map((plan) => [`${field}-${plan.id}`, plan.name])
    );

    const plansExemptFromQualityMeasures = updatePlanNames(
      reportFieldData.plansExemptFromQualityMeasures,
      planNames
    );

    return {
      ...dataToWrite,
      fieldData: {
        ...dataToWrite.fieldData,
        plansExemptFromQualityMeasures,
      },
    };
  }

  return dataToWrite;
};

export const updatePlanNames = (
  plans: AnyObject[],
  planNames: { [x: string]: string }
) => {
  return (
    plans
      .map((plan: AnyObject) => {
        // Look up plan name
        const name = planNames[plan.key];
        // If plan name isn't in object, it was deleted
        return name ? { key: plan.key, value: name } : undefined;
      })
      // Remove undefined plans from array
      .filter(Boolean)
  );
};
