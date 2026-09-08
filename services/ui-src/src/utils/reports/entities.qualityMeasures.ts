import { AnyObject, EntityType } from "types";

interface PerPlanResponse {
  response?: string;
}

interface MeasureRateResult {
  rateResult?: string;
}

interface MeasureResult {
  planName?: string;
  exempt?: boolean;
  notReporting?: boolean;
  notReportingReason?: AnyObject[];
  dataCollectionMethod?: string;
  rateResults?: MeasureRateResult[];
}

interface QualityMeasureStatus {
  started: boolean;
  completed: boolean;
}

export const isQualityMeasureV1 = (
  entityType: EntityType,
  formattedEntityData?: AnyObject
) => {
  return (
    entityType === EntityType.QUALITY_MEASURES &&
    formattedEntityData?.perPlanResponses !== undefined
  );
};

export const qualityMeasureV1Status = (
  perPlanResponses: PerPlanResponse[] = []
): QualityMeasureStatus => {
  const validPerPlanResponses = perPlanResponses.filter((el) => el.response);
  const started = validPerPlanResponses.length > 0;
  const completed =
    started && validPerPlanResponses.length === perPlanResponses.length;

  return { started, completed };
};

const isV2ResultComplete = (result: MeasureResult) => {
  if (result.notReporting) {
    return (
      Array.isArray(result.notReportingReason) &&
      result.notReportingReason.length > 0
    );
  }

  if (!result.dataCollectionMethod || !Array.isArray(result.rateResults)) {
    return false;
  }

  return (
    result.rateResults.length > 0 &&
    result.rateResults.every((rate) => Boolean(rate.rateResult))
  );
};

export const qualityMeasureV2Status = (
  measureResults: MeasureResult[] = []
): QualityMeasureStatus => {
  const nonExemptResults = measureResults.filter((result) => !result.exempt);

  if (nonExemptResults.length === 0) {
    return {
      started: false,
      completed: true,
    };
  }

  const validResults = nonExemptResults.filter(isV2ResultComplete);
  const started = validResults.length > 0;
  const completed = started && validResults.length === nonExemptResults.length;

  return { started, completed };
};
