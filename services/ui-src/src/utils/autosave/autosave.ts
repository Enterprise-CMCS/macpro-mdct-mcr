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

  // for each passed field, format for autosave payload (if changed)
  const fieldsToSave: FieldDataTuple[] = await Promise.all(
    fields
      // filter to only fields with changed values
      .filter((field: FieldInfo) => field.value !== field.hydrationValue)
      // determine appropriate field value to set and return as tuple
      .map(async (field: FieldInfo) => {
        const { name, value, defaultValue, overrideCheck } = field;
        const fieldValueIsValid = await form.trigger(name);
        // if field value is valid or validity check overriden, use field value
        if (fieldValueIsValid || overrideCheck) return [name, value];
        // otherwise, revert field to default value
        return [name, defaultValue];
      })
  );

  // if there are fields to save, create and send payload
  if (fieldsToSave.length) {
    const reportKeys = { id, state };
    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
      fieldData: Object.fromEntries(fieldsToSave), // create field data object
    };
    await updateReport(reportKeys, dataToWrite);

    // after successful autosave, update field values in form state
    fieldsToSave.forEach(([name, value]: FieldDataTuple) => {
      form.setValue(name, value);
    });
  }
};
