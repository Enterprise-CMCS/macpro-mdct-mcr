import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, EntityShape, ReportStatus } from "types";

const valueChanged = (currentValue: any, storedValue: any) => {
  return currentValue !== storedValue;
};

export const shouldAutosave = (
  currentValue: any,
  storedValue: any,
  autosave?: boolean,
  isStateRep?: boolean,
  isStateUser?: boolean
) => {
  return (
    valueChanged(currentValue, storedValue) &&
    autosave &&
    (isStateRep || isStateUser)
  );
};

export const getFieldValue = async (
  form: UseFormReturn<FieldValues, any>,
  fieldName: string,
  fieldValue: string | DropdownChoice | Choice[] | null,
  defaultValue = ""
) => {
  // check field data validity
  const fieldDataIsValid = await form.trigger(fieldName);

  // if valid, use; if not, reset to default
  return fieldDataIsValid ? fieldValue : defaultValue;
};

export const createReportKeys = (id?: string, state?: string) => ({
  state,
  id,
});

export const createDataToWrite = (
  status: ReportStatus,
  fieldName: string,
  fieldValue: string | DropdownChoice | EntityShape[] | Choice[] | null,
  lastAlteredBy?: string
) => ({
  metadata: {
    status,
    lastAlteredBy,
  },
  fieldData: { [fieldName]: fieldValue },
});
