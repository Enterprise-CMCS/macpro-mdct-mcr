import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, EntityShape, ReportStatus } from "types";

type FieldValue = string | Choice[] | DropdownChoice | EntityShape[] | null;

type FieldDataTuple = [string, FieldValue];

interface FieldInfo {
  name: string;
  value?: FieldValue;
  defaultValue?: any;
  hydrationValue?: FieldValue;
  overrideCheck?: boolean;
}

interface AutosaveFieldDataProps {
  form: UseFormReturn<FieldValues, any>;
  fields: FieldInfo[];
  report: {
    id: string | undefined;
    updateReport: Function;
  };
  user: {
    userName: string | undefined;
    state: string | undefined;
  };
}

export const autosaveFieldData = async ({
  form,
  fields,
  report,
  user,
}: AutosaveFieldDataProps) => {
  const { id, updateReport } = report;
  const { userName, state } = user;

  // getChangedFields -- if field value hasn't changed from database value, don't autosave field
  const changedFields = fields.filter((field: FieldInfo) => {
    const { value, hydrationValue } = field;
    const comparison = value !== hydrationValue;
    return comparison;
  });

  // determineFieldDataToSave -- for each passed field, prepare for autosave payload if necessary
  const fieldDataToSaveArray: FieldDataTuple[] = await Promise.all(
    changedFields.map(async (field: FieldInfo) => {
      const { name, value, defaultValue, overrideCheck } = field;
      // check field value validity
      const fieldValueIsValid = await form.trigger(name);
      // if field value is valid or validity check overriden, use field value
      if (fieldValueIsValid || overrideCheck) return [name, value];
      // otherwise, revert field to default value
      return [name, defaultValue];
    })
  );

  // if there are fields to save, create and send payload
  if (changedFields.length) {
    const reportKeys = { id, state };
    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
      // create field data object from array of field data to save
      fieldData: Object.fromEntries(fieldDataToSaveArray),
    };
    await updateReport(reportKeys, dataToWrite);

    // after successful autosave, update field values in form state
    fieldDataToSaveArray.forEach((field: FieldDataTuple) => {
      const [fieldName, fieldValue] = field;
      form.setValue(fieldName, fieldValue, { shouldValidate: true });
    });
  }
};
