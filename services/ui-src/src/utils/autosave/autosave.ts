import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, ReportStatus } from "types";

type FieldValue = string | DropdownChoice | Choice[] | null;

interface FieldInfo {
  name: string;
  value?: FieldValue;
  hydrationValue?: FieldValue;
  shouldClear?: boolean;
  defaultValue: any;
}

interface Props {
  form: UseFormReturn<FieldValues, any>;
  fields: FieldInfo[];
  report: {
    id: string | undefined;
    updateReport: Function;
  };
  user: {
    userName: string | undefined;
    state: string | undefined;
    isAuthorizedUser: boolean;
  };
}

export const autosaveFieldData = async ({
  form,
  fields,
  report,
  user,
}: Props) => {
  let fieldDataToSave: any = {};
  const { id, updateReport } = report;
  const { userName, state, isAuthorizedUser } = user;

  // for each passed field, prepare for autosave payload if necessary
  fields.forEach(async (field: FieldInfo) => {
    const { name, defaultValue } = field;

    // if field value hasn't changed from database value, don't autosave field
    const fieldValueChanged = field?.value !== field?.hydrationValue;
    if (!fieldValueChanged) return;

    // if field value is not valid or explicitly told to clear, revert to default value
    const fieldValueIsValid = await form.trigger(name);
    const fieldValueToSet =
      field.shouldClear || !fieldValueIsValid ? defaultValue : field?.value;

    // add field data to payload
    fieldDataToSave[name] = fieldValueToSet;
  });

  // check authorization and if any passed fields should be saved
  const fieldsToSave = Object.keys(fieldDataToSave);
  const shouldAutosave = isAuthorizedUser && fieldsToSave.length;

  if (shouldAutosave) {
    // finalize payload and save
    const reportKeys = { id, state };
    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
      fieldData: fieldDataToSave,
    };
    await updateReport(reportKeys, dataToWrite);

    // after successful autosave, set field values in form state
    fieldsToSave.forEach((name: string) => {
      const fieldValue = fieldDataToSave[name];
      form.setValue(name, fieldValue, { shouldValidate: true });
    });
  }
};
