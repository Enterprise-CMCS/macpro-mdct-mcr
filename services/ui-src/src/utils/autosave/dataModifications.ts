// types
import { AnyObject, EntityShape, ReportType } from "types";
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
  const plans = reportFieldData.plans;
  const exemptPlans =
    dataToWrite.fieldData.plansExemptFromQualityMeasures || [];

  if (exemptPlans.length > 0) {
    const planNames = Object.fromEntries(
      plans.map((plan: EntityShape) => [`${field}-${plan.id}`, plan.name])
    );

    const plansExemptFromQualityMeasures = updatePlanNames(
      exemptPlans,
      planNames
    );

    clearPlanMeasureData(
      dataToWrite,
      plans,
      plansExemptFromQualityMeasures,
      field
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
  return plans
    .filter((plan: AnyObject) => plan.key in planNames)
    .map((plan: AnyObject) => {
      // Look up plan name
      const name = planNames[plan.key];
      return { key: plan.key, value: name };
    });
};

export const clearPlanMeasureData = (
  dataToWrite: AnyObject,
  plans: EntityShape[],
  exemptPlans: AnyObject[],
  fieldKey: string
) => {
  const exemptPlanIds = exemptPlans.map(
    (plan) => plan?.key.split(`${fieldKey}-`)[1]
  );

  if (exemptPlanIds.length === 0) return;
  dataToWrite.fieldData.plans = plans;
  for (const plan of dataToWrite.fieldData.plans) {
    if (exemptPlanIds.includes(plan.id)) {
      plan.measures = undefined;
    }
  }
};
