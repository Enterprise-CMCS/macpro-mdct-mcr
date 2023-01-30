import { isEqual } from "lodash";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, EntityShape, ReportStatus } from "types";

type FieldValue = string | DropdownChoice | Choice[] | null;

type FieldTuple = [string, FieldValue];

interface FieldInfo {
  name: string;
  value?: FieldValue;
  displayValues?: EntityShape[];
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
  };
}

export const autosaveFieldData = async ({
  form,
  fields,
  report,
  user,
}: Props) => {
  const { id, updateReport } = report;
  const { userName, state } = user;

  // if field value hasn't changed from database value, don't autosave field
  const onlyChangedFields = fields.filter(
    // TODO: do we need a deeper equality check here?
    (field: FieldInfo) => {
      const { value, hydrationValue, defaultValue } = field;
      return value !== defaultValue && !isEqual(value, hydrationValue);
    }
  );

  // for each passed field, prepare for autosave payload if necessary
  const fieldDataToSaveArray: FieldTuple[] = await Promise.all(
    onlyChangedFields.map(async (field: FieldInfo) => {
      const { name, defaultValue } = field;

      // if field value is not valid or explicitly told to clear, revert to default value
      const fieldValueIsValid = await form.trigger(name);
      const fieldValueToSet =
        field.shouldClear || !fieldValueIsValid ? defaultValue : field?.value;

      // add field data to payload
      return [name, fieldValueToSet];
    })
  );

  const fieldDataToSaveObject = Object.fromEntries(fieldDataToSaveArray);

  if (fieldDataToSaveArray.length) {
    // finalize payload and save
    const reportKeys = { id, state };
    const dataToWrite = {
      metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
      fieldData: fieldDataToSaveObject,
    };
    await updateReport(reportKeys, dataToWrite);

    // after successful autosave, set field values in form state
    fieldDataToSaveArray.forEach((field: FieldTuple) => {
      const [fieldName, fieldValue] = field;
      form.setValue(fieldName, fieldValue, { shouldValidate: true });
    });
  }
};
