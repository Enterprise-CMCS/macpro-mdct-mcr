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
  keys: any[],
  keyMatchText: string,
  entity: EntityShape
) => {
  // find matching key in field data keys
  const dataKey: string = keys.find((key: string) =>
    key.endsWith(keyMatchText)
  );

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
    case EntityType.PLANS:
      if (!entity) {
        return {};
      }
      const plan = entity; // eslint-disable-line no-case-declarations

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

        // find geomapping data for display
        const indexOfGeomapping = analysisMethodsUsed.indexOf("Geomapping");
        if (indexOfGeomapping > -1) {
          const geomappingDisplayInfo: any[] = [];
          const geomappingKeys: any = planKeys.filter((key: string) =>
            key.includes("_geomappingComplianceFrequency")
          );

          // compliance frequency and type
          const geomappingComplianceFrequency = findEntityDataByKey(
            geomappingKeys,
            "_geomappingComplianceFrequency",
            plan
          );
          const geomappingEnrolleesMeetingStandard = findEntityDataByKey(
            geomappingKeys,
            "_enrolleesMeetingStandard",
            plan
          );
          // show second if first is not notansweredOptionalText
          let geomappingComplianceFrequencyDisplayText =
            "Frequency of compliance findings (optional): ";
          if (!geomappingComplianceFrequency) {
            geomappingComplianceFrequencyDisplayText += notAnsweredOptionalText;
          } else if (!geomappingEnrolleesMeetingStandard) {
            geomappingComplianceFrequencyDisplayText += `${geomappingComplianceFrequency}: ${notAnsweredOptionalText}`;
          } else {
            geomappingComplianceFrequencyDisplayText += `${geomappingComplianceFrequency}: ${geomappingEnrolleesMeetingStandard}:`;
          }
          geomappingDisplayInfo.push(geomappingComplianceFrequencyDisplayText);

          const geomappingData = [
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
          ];

          for (const { label, key } of geomappingData) {
            const value = findEntityDataByKey(geomappingKeys, key, plan);
            if (value) {
              geomappingDisplayInfo.push(`${label}: ${value}`);
            }
          }

          // add in to analysis methods array
          analysisMethodsUsed.splice(
            indexOfGeomapping + 1,
            0,
            ...geomappingDisplayInfo
          );
        }

        // find plan provider directory review data for display
        const indexOfPpdr = analysisMethodsUsed.indexOf(
          "Plan Provider Directory Review"
        );
        if (indexOfPpdr > -1) {
          const ppdrDisplayInfo: any[] = [];
          const ppdrKeys: any = planKeys.filter((key: string) =>
            key.includes("_ppdrComplianceFrequency")
          );

          // compliance frequency and type
          const ppdrComplianceFrequency = findEntityDataByKey(
            ppdrKeys,
            "_ppdrComplianceFrequency",
            plan
          );
          const ppdrEnrolleesMeetingStandard = findEntityDataByKey(
            ppdrKeys,
            "_enrolleesMeetingStandard",
            plan
          );
          // show second if first is not notansweredOptionalText
          let ppdrComplianceFrequencyDisplayText =
            "Frequency of compliance findings (optional): ";
          if (!ppdrComplianceFrequency) {
            ppdrComplianceFrequencyDisplayText += notAnsweredOptionalText;
          } else if (!ppdrEnrolleesMeetingStandard) {
            ppdrComplianceFrequencyDisplayText += `${ppdrComplianceFrequency}: ${notAnsweredOptionalText}`;
          } else {
            ppdrComplianceFrequencyDisplayText += `${ppdrComplianceFrequency}: ${ppdrEnrolleesMeetingStandard}:`;
          }
          ppdrDisplayInfo.push(ppdrComplianceFrequencyDisplayText);

          const ppdrData = [
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
          ];

          for (const { label, key } of ppdrData) {
            const value = findEntityDataByKey(ppdrKeys, key, plan);
            if (value) {
              ppdrDisplayInfo.push(`${label}: ${value}`);
            }
          }

          // add in to analysis methods array
          analysisMethodsUsed.splice(indexOfPpdr + 1, 0, ...ppdrDisplayInfo);
        }

        // find secret shopper: appointment availability data for display
        const indexOfSsaa = analysisMethodsUsed.indexOf(
          "Secret Shopper: Appointment Availability"
        );
        if (indexOfSsaa > -1) {
          const ssaaDisplayInfo: any[] = [];
          const ssaaKeys: any = planKeys.filter((key: string) =>
            key.includes("_ssaaComplianceFrequency")
          );

          // compliance frequency
          const ssaaComplianceFrequency = findEntityDataByKey(
            ssaaKeys,
            "_ssaaComplianceFrequency",
            plan
          );

          let ssaaComplianceFrequencyDisplayText = `Frequency of compliance findings (optional): `;
          if (!ssaaComplianceFrequency) {
            ssaaComplianceFrequencyDisplayText += notAnsweredOptionalText;
          } else {
            ssaaComplianceFrequencyDisplayText += `${ssaaComplianceFrequency}:`;
          }
          ssaaDisplayInfo.push(ssaaComplianceFrequencyDisplayText);

          const ssaaData = [
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
          ];

          for (const { label, key } of ssaaData) {
            const value = findEntityDataByKey(ssaaKeys, key, plan);
            if (value) {
              ssaaDisplayInfo.push(`${label}: ${value}`);
            }
          }

          // add in to analysis methods array
          analysisMethodsUsed.splice(indexOfSsaa + 1, 0, ...ssaaDisplayInfo);
        }

        const nonCompliancePlanToAchieveCompliance = findEntityDataByKey(
          planKeys,
          "-nonCompliancePlanToAchieveCompliance",
          plan
        );
        const nonComplianceMonitoringProgress = findEntityDataByKey(
          planKeys,
          "-nonComplianceMonitoringProgress",
          plan
        );
        const nonComplianceReassessmentDate = findEntityDataByKey(
          planKeys,
          "-nonComplianceReassessmentDate",
          plan
        );
        const nonComplianceDescription = findEntityDataByKey(
          planKeys,
          "-nonComplianceDescription",
          plan
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
          planKeys,
          "-exceptionsDescription",
          plan
        );
        const exceptionsJustification = findEntityDataByKey(
          planKeys,
          "-exceptionsJustification",
          plan
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
      return {
        heading: `Problem displaying data for ${plan?.name || "plan"}`,
      };
    default:
      return {};
  }
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
