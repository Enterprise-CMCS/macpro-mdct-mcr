import { FieldValue } from "types";

// Warning rules must remain pure functions with no React dependencies.
// This ensures they can be called from either useFormWarnings or
// the custom resolver in Phase 3 without modification.

// Warning rule functions — defined once per warning type
const warningRules: Record<
  string,
  (value: FieldValue | null | undefined) => string | null
> = {
  // TODO: REMOVE BEFORE MERGE - test warning rule
  DATE_BEFORE_2020: (value: FieldValue | null | undefined) =>
    value && new Date(value as string) < new Date("2020-01-01")
      ? "Date is before 2020 — is this correct?"
      : null,
  // Warning rules will be added here in subsequent tickets
};

// Field to warning type mapping — assign warning types to field ids here
const fieldWarningMap: Record<string, string> = {
  // TODO: REMOVE BEFORE MERGE - test field mapping
  program_whenWasTheLastParityAnalysisCoveringThisProgramCompleted:
    "DATE_BEFORE_2020",
  // Field mappings will be added here in subsequent tickets
};

export const validateFieldWarning = (
  fieldId: string,
  value: FieldValue | null | undefined
): string | null => {
  const warningType = fieldWarningMap[fieldId];
  if (!warningType) return null;
  const warningRule = warningRules[warningType];
  if (!warningRule) return null;
  return warningRule(value);
};
