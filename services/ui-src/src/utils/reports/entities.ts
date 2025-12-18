// types
import {
  AnyObject,
  EntityShape,
  EntityType,
  ModalDrawerReportPageVerbiage,
} from "types";
// utils
import { compareText, maskResponseData, otherSpecify, translate } from "utils";
import { getFormattedPlanData } from "./entities.plans";
import { useFlags } from "launchdarkly-react-client-sdk";

const getRadioValue = (entity: EntityShape | undefined, label: string) => {
  return otherSpecify(
    entity?.[label]?.[0].value,
    entity?.[`${label}-otherText`]
  );
};

const getCheckboxValues = (
  entity: EntityShape | undefined,
  label: string,
  customLabel?: string
) => {
  return entity?.[label]?.map((method: AnyObject) => {
    if (method.value === "Custom method") {
      return `Custom method - ${entity?.[`${label}-otherText`]}`;
    }
    return otherSpecify(
      method.value,
      entity?.[`${label}-otherText`],
      undefined,
      customLabel
    );
  });
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

// returns an array of { rateName: string, rateResult: string } or undefined
export const getMeasureResults = (
  entityId?: string,
  plans?: AnyObject,
  measureRates?: AnyObject[]
) => {
  return plans?.map((plan: AnyObject) => {
    const resultsPerPlan = measureRates?.map((rate: AnyObject) => {
      return {
        rate: rate.name,
        rateResult: plan.measures[entityId!][`measure_rate_results-${rate.id}`],
      };
    });
    return {
      planName: plan.name,
      ...resultsPerPlan,
    };
  });
};

export const getFormattedEntityData = (
  entityType: EntityType,
  entity?: EntityShape,
  reportFieldData?: AnyObject
) => {
  // LaunchDarkly
  const newQualityMeasuresSectionEnabled =
    useFlags()?.newQualityMeasuresSectionEnabled;

  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      return {
        category: entity?.accessMeasure_generalCategory[0].value,
        standardDescription: entity?.accessMeasure_standardDescription,
        standardType: getRadioValue(entity, "accessMeasure_standardType"),
        provider: getRadioValue(entity, "accessMeasure_providerType"),
        providerDetails:
          entity?.["accessMeasure_providerType-primaryCareDetails"] ||
          entity?.["accessMeasure_providerType-specialistDetails"] ||
          entity?.["accessMeasure_providerType-mentalHealthDetails"],
        region: getRadioValue(entity, "accessMeasure_applicableRegion"),
        population: getRadioValue(entity, "accessMeasure_population"),
        monitoringMethods: getCheckboxValues(
          entity,
          "accessMeasure_monitoringMethods",
          "Custom method"
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
      if (newQualityMeasuresSectionEnabled) {
        const yesCmit = entity?.measure_identifier?.[0].value === "Yes";
        const noCbe =
          entity?.measure_identifier?.[0].value ===
          "No, it has a Consensus Based Entity (CBE) number";
        const neitherCmitOrCbe =
          entity?.measure_identifier?.[0].value ===
          "No, it uses neither CMIT or CBE";
        return {
          id: entity?.id,
          name: entity?.measure_name,
          identifierType: getRadioValue(entity, "measure_identifier"),
          cmitNumber: yesCmit && entity?.measure_identifierCmit,
          cbeNumber: noCbe && entity?.measure_identifierCbe,
          description: neitherCmitOrCbe && entity?.measure_identifierDefinition,
          identifierDomain:
            neitherCmitOrCbe &&
            getCheckboxValues(entity, "measure_identifierDomain"),
          identifierUrl: neitherCmitOrCbe && entity?.measure_identifierUrl,
          dataVersion: getRadioValue(entity, "measure_dataVersion"),
          activities: getCheckboxValues(entity, "measure_activities"),
          measureRates: entity?.measure_rates,
          measureResults: getMeasureResults(
            entity?.id,
            reportFieldData?.["plans"],
            entity?.measure_rates
          ),
        };
      } else {
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
      }
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
      if (formattedEntityData.perPlanResponses?.[0].response) {
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
