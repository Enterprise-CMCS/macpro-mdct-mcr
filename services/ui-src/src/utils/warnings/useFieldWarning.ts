import { useFormContext, useWatch } from "react-hook-form";
// utils
import { useStore } from "utils/state/useStore";
import { validateFieldWarning } from "./warnings";

/*
 * Returns the warning message for a single form field, or null.
 * Call from inside a field component, the same way the field reads its own
 * error from form.formState.errors. Re-evaluates when the field's value or
 * the report data changes.
 */
export const useFieldWarning = (name: string): string | null => {
  const { control } = useFormContext();
  const value = useWatch({ control, name });
  const { report, selectedEntity } = useStore();
  return validateFieldWarning(name, value, { report, selectedEntity });
};
