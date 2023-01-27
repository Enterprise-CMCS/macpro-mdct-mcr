import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, ReportStatus } from "types";

interface Props {
  form: UseFormReturn<FieldValues, any>;
  field: {
    name: string;
    value: string | DropdownChoice | Choice[] | null;
    hydrationValue: string | DropdownChoice | Choice[] | null;
    defaultValue: string | DropdownChoice | Choice[] | null;
  };
  report: {
    id: string | undefined;
    state: string | undefined;
    updateReport: Function;
  };
  user: {
    userName: string | undefined;
    isAuthorizedUser: boolean;
  };
}

export const autosaveFieldData = async ({
  form,
  field,
  report,
  user,
}: Props) => {
  const { name, value: currentValue, hydrationValue, defaultValue } = field;
  const { id, state, updateReport } = report;
  const { userName, isAuthorizedUser } = user;

  // check authorization and compare field value to database value
  const fieldValueChanged = currentValue !== hydrationValue;
  const shouldAutosave = isAuthorizedUser && fieldValueChanged;

  if (shouldAutosave) {
    // if field value is valid, use; if not, revert to default value
    const fieldValueIsValid = await form.trigger(name);
    const fieldValueToSet = fieldValueIsValid ? currentValue : defaultValue;

    // create payload
    const reportKeys = { id, state };
    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
      fieldData: { [name]: fieldValueToSet },
    };
    await updateReport(reportKeys, dataToWrite);

    // set field value in form state
    form.setValue(name, fieldValueToSet, { shouldValidate: true });
  }
};
