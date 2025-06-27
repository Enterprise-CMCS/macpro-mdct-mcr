// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  ModalDrawerReportPageVerbiage,
} from "types";
// utils
import { compareText, maskResponseData, otherSpecify, translate } from "utils";

const notAnsweredOptionalText = "Not answered, optional";

const findEntityDataByKey = (
  entity: EntityShape,
  keys: any[],
  keyMatchText: string
) => {
  // find matching key in field data keys
  const dataKey = keys.find((key: string) => key.endsWith(keyMatchText));

  if (!dataKey) return;

  if (Array.isArray(entity[dataKey])) {
    if (entity[dataKey].length < 1) return;
    return entity[dataKey]?.[0]?.value;
  }
  if (entity[dataKey] === "") return;
  return entity[dataKey];
};

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return otherSpecify(
    entity?.[label]?.[0].value,
    entity?.[`${label}-otherText`]
  );
};

const getCheckboxValues = (entity: EntityShape | undefined, label: string) => {
  return entity?.[label]?.map((method: AnyObject) =>
    otherSpecify(method.value, entity?.[`${label}-otherText`])
  );
};

const getReportingRateType = (entity: EntityShape | undefined) => {
  const textToMatch = "Cross-program rate";
  const matchText = `${textToMatch}: ${entity?.qualityMeasure_crossProgramReportingRateProgramList}`;

  return compareText(
    textToMatch,
    entity?.qualityMeasure_reportingRateType?.[0]?.value,
    matchText
  );
};

const getReportingPeriod = (entity: EntityShape | undefined) => {
  const textToMatch = "No";
  const matchText = `${textToMatch}, ${entity?.qualityMeasure_reportingPeriodStartDate} - ${entity?.qualityMeasure_reportingPeriodEndDate}`;

  return compareText(
    textToMatch,
    entity?.qualityMeasure_reportingPeriod?.[0]?.value,
    matchText
  );
};

// returns an array of { planName: string, response: string } or undefined
export const getPlanValues = (entity?: EntityShape, plans?: AnyObject[]) =>
  plans?.map((plan: AnyObject) => ({
    name: plan.name,
    response: entity?.[`qualityMeasure_plan_measureResults_${plan.id}`],
  }));

export const getFormattedEntityData = (
  entityType: EntityType,
  entity?: EntityShape,
  reportFieldData?: AnyObject
) => {
  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      return {
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
    case EntityType.SANCTIONS:
      return {
        interventionType: getRadioValue(entity, "sanction_interventionType"),
        interventionTopic: getRadioValue(entity, "sanction_interventionTopic"),
        planName: reportFieldData?.plans?.find(
          (plan: any) => plan.id === entity?.sanction_planName.value
        )?.name,
        interventionReason: entity?.sanction_interventionReason,
        noncomplianceInstances: maskResponseData(
          entity?.sanction_noncomplianceInstances
        ),
        dollarAmount: maskResponseData(
          entity?.sanction_dollarAmount,
          "currency"
        ),
        assessmentDate: entity?.sanction_assessmentDate,
        remediationDate: entity?.sanction_remediationDate,
        remediationCompleted: getRadioValue(
          entity,
          "sanction_remediationCompleted"
        ),
        correctiveActionPlan: getRadioValue(
          entity,
          "sanction_correctiveActionPlan"
        ),
      };
    case EntityType.QUALITY_MEASURES:
      return {
        domain: getRadioValue(entity, "qualityMeasure_domain"),
        name: entity?.qualityMeasure_name,
        nqfNumber: entity?.qualityMeasure_nqfNumber,
        reportingRateType: getReportingRateType(entity),
        set: getRadioValue(entity, "qualityMeasure_set"),
        reportingPeriod: getReportingPeriod(entity),
        description: entity?.qualityMeasure_description,
        perPlanResponses: getPlanValues(entity, reportFieldData?.plans),
      };
    case EntityType.PLANS: {
      if (!entity) return {};
      const data = getFormattedPlanData(entity);
      return (
        data ?? {
          heading: `Problem displaying data for ${entity?.name || "plan"}`,
        }
      );
    }
    default:
      return {};
  }
};

const analysisMethodKeys = [
  { method: "Geomapping", filterKey: "_geomappingComplianceFrequency" },
  {
    method: "Plan Provider Directory Review",
    filterKey: "_ppdrComplianceFrequency",
  },
  {
    method: "Secret Shopper: Appointment Availability",
    filterKey: "_ssaaComplianceFrequency",
  },
];

const analysisMethodData = {
  Geomapping: [
    // percent of enrollees quarterly
    { label: "Q1 (optional)", key: "_q1PercentMetStandard" },
    { label: "Q2 (optional)", key: "_q2PercentMetStandard" },
    { label: "Q3 (optional)", key: "_q3PercentMetStandard" },
    { label: "Q4 (optional)", key: "_q4PercentMetStandard" },
    // actual max time quarterly
    { label: "Q1 (optional)", key: "_q1ActualMaxTime" },
    { label: "Q2 (optional)", key: "_q2ActualMaxTime" },
    { label: "Q3 (optional)", key: "_q3ActualMaxTime" },
    { label: "Q4 (optional)", key: "_q4ActualMaxTime" },
    // actual max distance quarterly
    { label: "Q1 (optional)", key: "_q1ActualMaxDist" },
    { label: "Q2 (optional)", key: "_q2ActualMaxDist" },
    { label: "Q3 (optional)", key: "_q3ActualMaxDist" },
    { label: "Q4 (optional)", key: "_q4ActualMaxDist" },
    // percent of enrollees annually
    { label: "Annual (optional)", key: "_annualPercentMetStandard" },
    {
      label: "Date of analysis of annual snapshot (optional)",
      key: "_annualPercentMetStandardDate",
    },
    // actual max time annually
    { label: "Annual (optional)", key: "_annualMaxTime" },
    {
      label: "Date of analysis of annual snapshot (optional)",
      key: "_annualMaxTimeDate",
    },
    // actual max distance annually
    { label: "Annual (optional)", key: "_actualMaxDistance" },
    {
      label: "Date of analysis of annual snapshot (optional)",
      key: "_actualMaxDistanceDate",
    },
  ],
  "Plan Provider Directory Review": [
    // number of network providers quarterly
    { label: "Q1 (optional)", key: "_q1NumberOfNetworkProviders" },
    { label: "Q2 (optional)", key: "_q2NumberOfNetworkProviders" },
    { label: "Q3 (optional)", key: "_q3NumberOfNetworkProviders" },
    { label: "Q4 (optional)", key: "_q4NumberOfNetworkProviders" },
    // provider to enrollee ratio quarterly
    { label: "Q1 (optional)", key: "_q1ProviderToEnrolleeRatio" },
    { label: "Q2 (optional)", key: "_q2ProviderToEnrolleeRatio" },
    { label: "Q3 (optional)", key: "_q3ProviderToEnrolleeRatio" },
    { label: "Q4 (optional)", key: "_q4ProviderToEnrolleeRatio" },
    // number of network providers annually
    {
      label: "Annual (optional)",
      key: "_annualMinimumNumberOfNetworkProviders",
    },
    {
      label: "Date of analysis of annual snapshot (optional)",
      key: "_annualMinimumNumberOfNetworkProvidersDate",
    },
    // provider to enrollee ratio annually
    {
      label: "Annual (optional)",
      key: "_annualProviderToEnrolleeRatio",
    },
    {
      label: "Date of analysis of annual snapshot (optional)",
      key: "_annualProviderToEnrolleeRatioDate",
    },
  ],
  "Secret Shopper: Appointment Availability": [
    // quarterly
    { label: "Q1 (optional)", key: "_q1Ssaa" },
    { label: "Q2 (optional)", key: "_q2Ssaa" },
    { label: "Q3 (optional)", key: "_q3Ssaa" },
    { label: "Q4 (optional)", key: "_q4Ssaa" },
    // number of network providers annually
    { label: "Annual (optional)", key: "_annualSsaa" },
    {
      label: "Date of analysis of annual snapshot (optional)",
      key: "_annualDateSsaa",
    },
  ],
};

const getFormattedPlanData = (plan: EntityShape) => {
  // display information for non-compliant standards
  if (plan?.exceptionsNonCompliance === nonComplianceStatus) {
    // get all analysis methods selected in plan non-compliance
    const planKeys = Object.keys(plan);
    const nonComplianceAnalysesKey: any = planKeys.find((key: string) =>
      key.endsWith("-nonComplianceAnalyses")
    );
    const analysisMethodsUsed = plan[nonComplianceAnalysesKey].map(
      (method: EntityShape) => method.value
    );

    // get all nested analysis method data
    analysisMethodKeys.forEach((analysisMethod: AnyObject) => {
      const { method, filterKey } = analysisMethod;
      const methodIndex = analysisMethodsUsed.indexOf(method);

      if (methodIndex < 0) return;

      const displayInfo = [];
      const methodKeys = planKeys.filter((key: string) =>
        key.includes(filterKey)
      );

      // get frequency display text for each method type
      let frequencyDisplayText =
        "Frequency of compliance findings (optional): ";
      if (method === "Geomapping") {
        // compliance frequency and type
        const geomappingComplianceFrequency = findEntityDataByKey(
          plan,
          methodKeys,
          "_geomappingComplianceFrequency"
        );
        const geomappingEnrolleesMeetingStandard = findEntityDataByKey(
          plan,
          methodKeys,
          "EnrolleesMeetingStandard"
        );
        // show second if first is not notansweredOptionalText
        if (!geomappingComplianceFrequency) {
          frequencyDisplayText += notAnsweredOptionalText;
        } else if (!geomappingEnrolleesMeetingStandard) {
          frequencyDisplayText += `${geomappingComplianceFrequency}: ${notAnsweredOptionalText}`;
        } else {
          frequencyDisplayText += `${geomappingComplianceFrequency}: ${geomappingEnrolleesMeetingStandard}:`;
        }
        displayInfo.push(frequencyDisplayText);
      } else if (method === "Plan Provider Directory Review") {
        // compliance frequency and type
        const ppdrComplianceFrequency = findEntityDataByKey(
          plan,
          methodKeys,
          "_ppdrComplianceFrequency"
        );
        const ppdrEnrolleesMeetingStandard = findEntityDataByKey(
          plan,
          methodKeys,
          "EnrolleesMeetingStandard"
        );
        // show second if first is not notansweredOptionalText
        if (!ppdrComplianceFrequency) {
          frequencyDisplayText += notAnsweredOptionalText;
        } else if (!ppdrEnrolleesMeetingStandard) {
          frequencyDisplayText += `${ppdrComplianceFrequency}: ${notAnsweredOptionalText}`;
        } else {
          frequencyDisplayText += `${ppdrComplianceFrequency}: ${ppdrEnrolleesMeetingStandard}:`;
        }
        displayInfo.push(frequencyDisplayText);
      } else if (method === "Secret Shopper: Appointment Availability") {
        // compliance frequency
        const ssaaComplianceFrequency = findEntityDataByKey(
          plan,
          methodKeys,
          "_ssaaComplianceFrequency"
        );

        if (!ssaaComplianceFrequency) {
          frequencyDisplayText += notAnsweredOptionalText;
        } else {
          frequencyDisplayText += `${ssaaComplianceFrequency}:`;
        }
        displayInfo.push(frequencyDisplayText);
      }

      // get the rest of the nested data entered
      for (const { label, key } of analysisMethodData[
        method as keyof typeof analysisMethodData
      ]) {
        const value = findEntityDataByKey(plan, methodKeys, key);
        if (value) {
          displayInfo.push(`${label}: ${value}`);
        }
      }

      // add to analysis methods array for display
      analysisMethodsUsed.splice(methodIndex + 1, 0, ...displayInfo);
    });

    const nonCompliancePlanToAchieveCompliance = findEntityDataByKey(
      plan,
      planKeys,
      "-nonCompliancePlanToAchieveCompliance"
    );
    const nonComplianceMonitoringProgress = findEntityDataByKey(
      plan,
      planKeys,
      "-nonComplianceMonitoringProgress"
    );
    const nonComplianceReassessmentDate = findEntityDataByKey(
      plan,
      planKeys,
      "-nonComplianceReassessmentDate"
    );
    const nonComplianceDescription = findEntityDataByKey(
      plan,
      planKeys,
      "-nonComplianceDescription"
    );

    return {
      heading: `Plan deficiencies for ${
        plan?.name || "plan"
      }: 42 C.F.R. § 438.68`,
      questions: [
        {
          question: "Description",
          answer: nonComplianceDescription,
        },
        {
          question: "Analyses used to identify deficiencies",
          answer: analysisMethodsUsed,
        },
        {
          question: "What the plan will do to achieve compliance",
          answer: nonCompliancePlanToAchieveCompliance,
        },
        {
          question: "Monitoring progress",
          answer: nonComplianceMonitoringProgress,
        },
        {
          question: "Reassessment date",
          answer: nonComplianceReassessmentDate,
        },
      ],
    };
  }

  // display information for exceptions standards
  if (plan?.exceptionsNonCompliance === exceptionsStatus) {
    const planKeys = Object.keys(plan);
    const exceptionsDescription = findEntityDataByKey(
      plan,
      planKeys,
      "-exceptionsDescription"
    );
    const exceptionsJustification = findEntityDataByKey(
      plan,
      planKeys,
      "-exceptionsJustification"
    );

    return {
      heading: `Exceptions granted for ${
        plan?.name || "plan"
      } under 42 C.F.R. § 438.68(d)`,
      questions: [
        {
          question:
            "Describe any network adequacy standard exceptions that the state has granted to the plan under 42 C.F.R. § 438.68(d).",
          answer: exceptionsDescription,
        },
        {
          question:
            "Justification for exceptions granted under 42 C.F.R. § 438.68(d)",
          answer: exceptionsJustification,
        },
      ],
    };
  }
  return;
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);

export const getAddEditDrawerText = (
  entityType: EntityType,
  formattedEntityData: AnyObject,
  verbiage: ModalDrawerReportPageVerbiage
) => {
  let addEditDrawerText = "Add";
  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      if (formattedEntityData.provider) {
        addEditDrawerText = "Edit";
      }
      break;
    case EntityType.QUALITY_MEASURES:
      if (formattedEntityData.perPlanResponses[0].response) {
        addEditDrawerText = "Edit";
      }
      break;
    case EntityType.SANCTIONS:
      if (formattedEntityData.assessmentDate) {
        addEditDrawerText = "Edit";
      }
      break;
    default:
      break;
  }
  return translate(verbiage.drawerTitle, { action: addEditDrawerText });
};
