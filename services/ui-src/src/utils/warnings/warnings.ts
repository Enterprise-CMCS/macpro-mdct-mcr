import { EntityShape, FieldValue, ReportShape } from "types";
// TODO: REMOVE BEFORE MERGE - only needed by the test warning rule
import { dateFormatRegex } from "utils/validation/schemas";

export interface WarningContext {
  report?: ReportShape;
  selectedEntity?: EntityShape;
}

export type WarningRule = (
  value: FieldValue | null | undefined,
  context: WarningContext
) => string | null;

// Warning rule functions — defined once per warning type
const warningRules: Record<string, WarningRule> = {
  // TODO: REMOVE BEFORE MERGE - test warning rule
  DATE_BEFORE_2020: (value) =>
    value && new Date(value as string) < new Date("2020-01-01")
      ? "Date is before 2020 — is this correct?"
      : null,
  // Warning rules will be added here in subsequent tickets
};

// Field to warning type mapping — assign warning types to field names here
const fieldWarningMap: Record<string, string> = {
  // TODO: REMOVE BEFORE MERGE - test field mapping
  program_whenWasTheLastParityAnalysisCoveringThisProgramCompleted:
    "DATE_BEFORE_2020",
  // Field mappings will be added here in subsequent tickets
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
