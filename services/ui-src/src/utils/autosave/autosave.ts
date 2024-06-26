import { FieldValues, UseFormReturn } from "react-hook-form";
import { AutosaveField, EntityShape, EntityType, ReportStatus } from "types";

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
    reportType: string | undefined;
    updateReport: Function;
  };
  user: {
    userName: string | undefined;
    state: string | undefined;
  };
  entityContext?: EntityContextShape;
}

export interface GetAutosaveFieldsProps extends AutosaveField {
  entityContext?: EntityContextShape;
}

/**
 * Current context for editing entities.
 *
 * This is a mirror of the EntityContext from EntityProvider,
 * used to allow non-components to access the Context values.
 */
export interface EntityContextShape {
  selectedEntity?: EntityShape;
  entities: EntityShape[];
  entityType?: EntityType;
  updateEntities: Function;
}

/**
 * Get formatted autosave fields from field data.
 * If entity context is passed, update the selected entity
 * within the total array of entities, and use that
 * full data to update the report.
 *
 * @param GetAutosaveFieldsProps
 * @returns
 */
export const getAutosaveFields = ({
  name,
  type,
  value,
  defaultValue,
  hydrationValue,
  overrideCheck,
}: GetAutosaveFieldsProps): FieldInfo[] => {
  return [
    {
      name,
      type,
      value,
      defaultValue,
      hydrationValue,
      overrideCheck,
    },
  ];
};

export const autosaveFieldData = async ({
  form,
  fields,
  report,
  user,
  entityContext,
}: Props) => {
  const { id, reportType, updateReport } = report;
  const { userName, state } = user;
  // for each passed field, format for autosave payload (if changed)
  const fieldsToSave: FieldDataTuple[] = await Promise.all(
    fields
      // filter to only changed fields
      .filter((field: FieldInfo) => isFieldChanged(field))
      // determine appropriate field value to set and return as tuple
      .map(async (field: FieldInfo) => {
        const { name, value, defaultValue, hydrationValue, overrideCheck } =
          field;
        let fieldValueIsValid = false;
        /*
         * This will trigger validation if and only if the field has been rendered on the page
         * at least once and therefore has sent a value (empty or otherwise) to the db.
         */
        if (value !== hydrationValue && hydrationValue !== undefined) {
          fieldValueIsValid = await form.trigger(name);
        } else {
          fieldValueIsValid = true;
        }
        // if field value is valid or validity check overridden, use field value
        if (fieldValueIsValid || overrideCheck) return [name, value];
        // otherwise, revert field to default value
        return [name, defaultValue];
      })
  );

  // if there are fields to save, create and send payload
  if (fieldsToSave.length) {
    const reportKeys = { reportType, id, state };
    let dataToWrite = {};
    if (
      entityContext &&
      entityContext.selectedEntity &&
      entityContext.entityType
    ) {
      dataToWrite = {
        metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
        fieldData: {
          [entityContext.entityType]: entityContext.updateEntities(
            Object.fromEntries(fieldsToSave)
          ),
        }, // create field data object
      };
    } else {
      dataToWrite = {
        metadata: { status: ReportStatus.IN_PROGRESS, lastAlteredBy: userName },
        fieldData: Object.fromEntries(fieldsToSave), // create field data object
      };
    }

    await updateReport(reportKeys, dataToWrite);
  }
};

export const isFieldChanged = (field: FieldInfo) => {
  const { type, value, hydrationValue } = field;
  if (type === "dynamic") {
    const changedEntities = value?.filter(
      (entity: EntityShape, index: number) => {
        // if value is solely whitespace (e.g. "   "), coerce to empty string
        if (!entity.name.trim()) entity.name = "";

        const entityValue = entity.name;
        const entityHydrationValue = hydrationValue?.[index]?.name;

        // handle uninitiated field with blank input
        const isUninitiated = !entityHydrationValue;
        const isBlank = !entityValue;

        if (isUninitiated && isBlank) return false;
        /*
         * note: we should be able to simply check entityValue !== entityHydrationValue here,
         * but DynamicField's hydrationValue is being partially controlled by react-hook-form
         * via useFieldArray, which keeps it always in sync with displayValues and form state,
         * making the check always evaluate to false because they are always equal.
         *
         * currently if the field has ever been initiated (saved before), we are triggering an
         * autosave on blur, regardless of if the field has changed, because we have no easy way
         * of determining if the field has changed.
         *
         * TODO: modify DynamicField hydrationValue lifecycle so we can implement a stricter check,
         * like entityValue !== entityHydrationValue or equivalent.
         */
        return true;
      }
    );
    return changedEntities?.length;
  }
  return value !== hydrationValue;
};
