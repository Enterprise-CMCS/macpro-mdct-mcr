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
  const { id, updateReport } = report;
  const { userName, state, isAuthorizedUser } = user;

  // fields.reduce(async (obj, field: FieldInfo) => {
  //   console.log("field im mappin", field);

  //   const { name, defaultValue } = field;

  //   // if field value hasn't changed from database value, don't autosave field
  //   const fieldValueChanged = field?.value !== field?.hydrationValue;
  //   if (!fieldValueChanged) return;
  //   console.log("fieldValueChanged", fieldValueChanged);

  //   // if field value is not valid or explicitly told to clear, revert to default value
  //   const fieldValueIsValid = await form.trigger(name);
  //   const fieldValueToSet =
  //     field.shouldClear || !fieldValueIsValid ? defaultValue : field?.value;

  //   return (obj[name] = fieldValueToSet, obj), {});

  // for each passed field, prepare for autosave payload if necessary
  const fieldDataToSave = await Promise.all(
    fields.reduce((obj, field: FieldInfo) => ((obj[item.key] = item.value), obj), {})
  );

  // check authorization and if any passed fields should be saved
  const shouldAutosave = isAuthorizedUser && fieldDataToSave.length;
  console.log("fieldDataToSave", fieldDataToSave);

  console.log({ shouldAutosave });

  if (shouldAutosave) {
    console.log("behold, i autosave");

    // finalize payload and save
    const reportKeys = { id, state };
    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
      fieldData: fieldDataToSave,
    };
    await updateReport(reportKeys, dataToWrite);

    // after successful autosave, set field values in form state
    // fieldDataToSave.forEach((name: string) => {
    //   const fieldValue = fieldDataToSave[name];
    //   form.setValue(name, fieldValue, { shouldValidate: true });
    // });
  }
};
