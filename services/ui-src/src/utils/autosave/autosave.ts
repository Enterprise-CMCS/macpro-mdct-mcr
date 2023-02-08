import { FieldValues, UseFormReturn } from "react-hook-form";
import { EntityShape, ReportStatus } from "types";

type FieldValue = any;

type FieldDataTuple = [string, FieldValue];

interface FieldInfo {
  name: string;
  type: string;
  value?: FieldValue;
  defaultValue?: any;
  hydrationValue?: FieldValue;
  overrideCheck?: boolean;
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

  // for each passed field, format for autosave payload (if changed)
  const fieldsToSave: FieldDataTuple[] = await Promise.all(
    fields
      // filter to only changed fields
      .filter((field: FieldInfo) => isFieldChanged(field))
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
  }
};

const isFieldChanged = (field: FieldInfo) => {
  const { type, value, hydrationValue } = field;
  if (type === "dynamic") {
    const changedEntities = value?.filter(
      (entity: EntityShape, index: number) => {
        const entityValue = entity.name;
        const entityHydrationValue = hydrationValue?.[index]?.name;
        // handle first-time display
        const isUninitiated = !entityHydrationValue;
        const isBlank = !entityValue;
        if (isUninitiated && isBlank) return false;
        // handle all other conditions
        const entityValueChanged = entityValue !== entityHydrationValue;
        /*
         * note: the value !== hydrationValue check *should* work,
         * but it doesn't, because the value and hydrationValue passed in
         * are always the exact same (unless the field is uninitiated,
         * i.e.the first time display). in DynamicField, there are actually 3 values that are
         * always the exact same: displayValues, hydrationValue (props.hydrate), and form value
         * (form.getValues(name)). why is this?
         *
         * the old logic here was:
         * entity.name ||(entity.name === "" && hydrationValue !== undefined && value !== hydrationValue)
         *
         * so essentially save the field if one of the following:
         *     - any of the entity input text fields has text in it, or
         *     - the dynamic field is uninitiated and the entity field is blank and the value is not equal to the hydration value
         *
         * but we already know the hydration value is always gonna be the same as the hydration value, right? so we need to figure out a way to fix that. without breaking anything else.
         */
        return entityValueChanged;
      }
    );
    return changedEntities?.length;
  }
  return value !== hydrationValue;
};
