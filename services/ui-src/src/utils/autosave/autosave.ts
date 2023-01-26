import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, ReportStatus } from "types";
import { AnyObject } from "yup/lib/types";

const valueChanged = (displayValue: any, databaseValue: any) => {
  return displayValue !== databaseValue;
};

export const shouldAutosave = (
  displayValue: any,
  databaseValue: any,
  autosave?: boolean,
  isStateRep?: boolean,
  isStateUser?: boolean
) => {
  return (
    valueChanged(displayValue, databaseValue) &&
    autosave &&
    (isStateRep || isStateUser)
  );
};

export const validateAndSetValue = async (
  form: UseFormReturn<FieldValues, any>,
  fieldName: string,
  fieldValue: string | DropdownChoice | Choice[] | null,
  defaultValue: any
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
  fieldData: AnyObject,
  lastAlteredBy?: string
) => ({
  metadata: {
    status: ReportStatus.IN_PROGRESS,
    lastAlteredBy,
  },
  fieldData,
});
