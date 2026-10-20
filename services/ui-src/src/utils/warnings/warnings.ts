import { EntityShape, FieldValue, ReportShape } from "types";

// Warning rules must remain pure functions with no React dependencies.
// This ensures they can be called from either useFieldWarning or
// the custom resolver in Phase 3 without modification.

export interface WarningContext {
  report?: ReportShape;
  selectedEntity?: EntityShape;
}

export type WarningRule = (
  value: FieldValue | null | undefined,
  context: WarningContext
) => string | null;

// Helper to parse a number from a field value, handling comma-formatted numbers
const parseNumber = (value: FieldValue | null | undefined): number | null => {
  if (!value) return null;
  const num = Number(String(value).replaceAll(",", ""));
  return isNaN(num) ? null : num;
};

// Helper to parse a date from a field value
const parseDate = (value: FieldValue | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? null : date;
};

// Warning rule functions — defined once per warning type
const warningRules: Record<string, WarningRule> = {
  // DATE WARNINGS
  DATE_BEFORE_2020: (value) => {
    const date = parseDate(value);
    if (!date) return null;
    return date < new Date("2020-01-01")
      ? "Dates prior to 2020 are not expected in this field. Review for accuracy."
      : null;
  },

  DATE_BEFORE_2023: (value) => {
    const date = parseDate(value);
    if (!date) return null;
    return date < new Date("2023-01-01")
      ? "Dates prior to 2023 are not expected in this field. Review for accuracy."
      : null;
  },

  // NUMBER WARNINGS
  DIVISIBLE_BY_1000: (value) => {
    const num = parseNumber(value);
    if (num === null || num === 0) return null;
    return num % 1000 === 0
      ? "This value appears to be rounded to the nearest 1,000. If the value is accurate, no action is needed. Otherwise, enter the exact enrollment value."
      : null;
  },

  PERCENTAGE_OVER_100: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 100
      ? "Percentage is higher than 100%. Review for accuracy."
      : null;
  },

  NUMBER_OVER_OR_EQUAL_100: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num >= 100
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_OVER_14: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 14
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_OVER_72: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 72
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_OVER_215000: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 215000
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_BELOW_75: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num < 75
      ? "This number is unusually low. Review for accuracy."
      : null;
  },

  NUMBER_BELOW_90: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num < 90
      ? "This number is unusually low. Review for accuracy."
      : null;
  },

  NUMBER_OVER_7_1: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 7.1
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_OVER_7: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 7
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_OVER_60: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 60
      ? "This number is unusually high. Review for accuracy."
      : null;
  },

  NUMBER_OVER_24: (value) => {
    const num = parseNumber(value);
    if (num === null) return null;
    return num > 24
      ? "This number is unusually high. Review for accuracy."
      : null;
  },
};

// Field to warning type mapping — organized by form/file location
const fieldWarningMap: Record<string, string> = {
  // A - Program Information (program-information/reporting-period.ts)
  reportingPeriodStartDate: "DATE_BEFORE_2020", // A.5a
  reportingPeriodEndDate: "DATE_BEFORE_2020", // A.5b

  // B - State Level Indicators (state-level-indicators/program-characteristics.ts)
  state_statewideMedicaidEnrollment: "DIVISIBLE_BY_1000", // B.I.1
  state_statewideMedicaidManagedCareEnrollment: "DIVISIBLE_BY_1000", // B.I.2

  // B - State Level Indicators (state-level-indicators/prior-authorization.ts)
  state_stateTimeframeForStandardPriorAuthorizationDecisions: "NUMBER_OVER_14", // B.XIII.1b
  state_stateTimeframeForExpeditedPriorAuthorizationDecisions: "NUMBER_OVER_72", // B.XIII.2b

  // C - Program Level Indicators (program-level-indicators/program-characteristics.ts)
  program_enrollment: "DIVISIBLE_BY_1000", // C1.I.5

  // C - Program Level Indicators (program-level-indicators/mental-health-and-substance-use-disorder-parity.ts)
  program_whenWasTheLastParityAnalysisCoveringThisProgramCompleted:
    "DATE_BEFORE_2020", // C1.XII.8
  program_whenWasTheLastParityAnalysisForThisProgramSubmittedToCMS:
    "DATE_BEFORE_2020", // C1.XII.9
  dateStateWillRemediateThisAreaOfNoncompliance: "DATE_BEFORE_2020", // C1.XII.12c

  // D - Plan Level Indicators (plan-level-indicators/program-characteristics.ts)
  plan_medicaidEnrollmentSharePercentage: "PERCENTAGE_OVER_100", // D1.I.2
  plan_medicaidManagedCareEnrollmentSharePercentage: "PERCENTAGE_OVER_100", // D1.I.3

  // D - Plan Level Indicators (plan-level-indicators/encounter-data-report.ts)
  plan_encounterDataSubmissionTimelinessCompliancePercentage: "NUMBER_BELOW_75", // D1.III.2
  plan_encounterDataSubmissionHipaaCompliancePercentage: "NUMBER_BELOW_90", // D1.III.3

  // D - Plan Level Indicators - Appeals (plan-level-indicators/appeals-state-fair-hearings-and-grievances/appeals-overview.ts)
  plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledAppeal:
    "NUMBER_OVER_OR_EQUAL_100", // D1.IV.4

  // D - Plan Level Indicators - Grievances (plan-level-indicators/appeals-state-fair-hearings-and-grievances/grievances-overview.ts)
  plan_ltssUserFiledCriticalIncidentsWhenPreviouslyFiledGrievance:
    "NUMBER_OVER_OR_EQUAL_100", // D1.IV.13

  // D - Plan Level Indicators - Program Integrity (plan-level-indicators/program-integrity.ts)
  plan_overpaymentReportingToStateStartDate: "DATE_BEFORE_2020", // D1.X.9a
  plan_overpaymentReportingToStateEndDate: "DATE_BEFORE_2020", // D1.X.9b

  // D - Plan Level Indicators - Prior Authorization (plan-level-indicators/prior-authorization.ts)
  plan_averageTimeToDecisionForStandardPriorAuthorizations: "NUMBER_OVER_7_1", // D1.XIII.9
  plan_medianTimeToDecisionOnStandardPriorAuthorizations: "NUMBER_OVER_7", // D1.XIII.10
  plan_averageTimeToDecisionForExpeditedPriorAuthorizations: "NUMBER_OVER_60", // D1.XIII.13
  plan_medianTimeToDecisionOnExpeditedPriorAuthorizationRequests:
    "NUMBER_OVER_24", // D1.XIII.14

  // D - Plan Level Indicators - Sanctions (plan-level-indicators/sanctions.ts)
  sanction_dollarAmount: "NUMBER_OVER_215000", // D3.VIII.6
  sanction_assessmentDate: "DATE_BEFORE_2023", // D3.VIII.7
  sanction_remediationDate: "DATE_BEFORE_2023", // D3.VIII.8a
};

export const validateFieldWarning = (
  fieldName: string,
  value: FieldValue | null | undefined,
  context: WarningContext = {},
  map: Record<string, string> = fieldWarningMap,
  rules: Record<string, WarningRule> = warningRules
): string | null => {
  const warningType = map[fieldName];
  if (!warningType) return null;
  const warningRule = rules[warningType];
  if (!warningRule) return null;
  return warningRule(value, context);
};
