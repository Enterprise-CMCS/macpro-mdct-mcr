import { FieldValues, UseFormReturn } from "react-hook-form";
import { Choice, DropdownChoice, EntityShape, ReportStatus } from "types";

type FieldValue = string | DropdownChoice | Choice[] | EntityShape[] | null;

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
  fieldType?: string;
}

export const autosaveFieldData = async ({
  form,
  fields,
  report,
  user,
  fieldType,
}: Props) => {
  const { id, updateReport } = report;
  const { userName, state } = user;
  let onlyChangedFields = [];
  switch (fieldType) {
    case "dynamic":
      onlyChangedFields = fields.filter((field: FieldInfo) => {
        const checkedValues = field.displayValues?.filter((el) => el.name);
        return (
          checkedValues?.length !== 0 &&
          field.displayValues !== field?.hydrationValue
        );
      });
      break;

    default:
      // if field value hasn't changed from database value, don't autosave field
      onlyChangedFields = fields.filter(
        // TODO: do we need a deeper equality check here?
        (field: FieldInfo) => {
          return field?.value !== field?.hydrationValue;
        }
      );
      break;
  }

  // for each passed field, prepare for autosave payload if necessary
  const fieldDataToSaveArray: FieldTuple[] = await Promise.all(
    onlyChangedFields.map(async (field: FieldInfo) => {
      const { name, defaultValue, value, displayValues } = field;
      const toSetValue = displayValues ? displayValues : value;
      // if field value is not valid or explicitly told to clear, revert to default value
      const fieldValueIsValid = await form.trigger(name);
      const fieldValueToSet =
        field.shouldClear || !fieldValueIsValid ? defaultValue : toSetValue;

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
