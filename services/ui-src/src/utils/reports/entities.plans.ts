// constants
import { exceptionsStatus, nonComplianceStatus } from "../../constants";
// types
import { EntityShape, ReportShape } from "types";

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

const addComplianceDisplayInfo = (
  displayInfo: any[],
  plan: EntityShape,
  methodKeys: string[],
  method: string
) => {
  // get frequency display text for each method type
  let frequencyDisplayText = "Frequency of compliance findings (optional): ";
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
    // show second if first is not notAnsweredOptionalText
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
};

const getAnalysisMethodData = (
  method: string,
  filterKey: string,
  plan: EntityShape
) => {
  const planKeys = Object.keys(plan);
  const displayInfo: any[] = [];
  const methodKeys = planKeys.filter((key: string) => key.includes(filterKey));

  addComplianceDisplayInfo(displayInfo, plan, methodKeys, method);

  // get the rest of the nested data entered
  for (const { label, key } of analysisMethodData[
    method as keyof typeof analysisMethodData
  ]) {
    const value = findEntityDataByKey(plan, methodKeys, key);
    if (value) {
      displayInfo.push(`${label}: ${value}`);
    }
  }

  return displayInfo;
};

const getFormattedNonComplianceData = (plan: EntityShape) => {
  const planKeys = Object.keys(plan);
  // get all analysis methods selected in plan non-compliance
  const nonComplianceAnalysesKey: any = planKeys.find((key: string) =>
    key.endsWith("-nonComplianceAnalyses")
  );
  const analysisMethodsUsed = plan[nonComplianceAnalysesKey].map(
    (method: EntityShape) => method.value
  );

  // get all nested analysis method data
  analysisMethodKeys.forEach(
    ({ method, filterKey }: { method: string; filterKey: string }) => {
      const methodIndex = analysisMethodsUsed.indexOf(method);
      if (methodIndex < 0) return;

      const displayInfo = getAnalysisMethodData(method, filterKey, plan);

      // add to analysis methods array for display
      analysisMethodsUsed.splice(methodIndex + 1, 0, ...displayInfo);
    }
  );

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
};

const getFormattedExceptionsData = (plan: EntityShape) => {
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
};

export const getFormattedPlanData = (plan: EntityShape) => {
  const complianceStatus = plan?.exceptionsNonCompliance;

  // display information for non-compliant standards
  if (complianceStatus === nonComplianceStatus) {
    return getFormattedNonComplianceData(plan);
  }

  // display information for exceptions standards
  if (plan?.exceptionsNonCompliance === exceptionsStatus) {
    return getFormattedExceptionsData(plan);
  }
  return;
};

export const getPlansNotExemptFromQualityMeasures = (
  report: ReportShape
): EntityShape[] => {
  const plans = report.fieldData?.plans || [];
  const exemptedPlanIds =
    report.fieldData?.plansExemptFromQualityMeasures?.map(
      (exemption: EntityShape) =>
        exemption.key?.replace("plansExemptFromQualityMeasures-", "")
    ) || [];

  return plans.filter(
    (plan: EntityShape) => !exemptedPlanIds.includes(plan.id)
  );
};
