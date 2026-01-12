import { mcparFieldsToCopy, naaarFieldsToCopy } from "../constants/copyover";
import { getPossibleFieldsFromFormTemplate } from "../formTemplates/formTemplates";
import s3Lib, { getFieldDataKey } from "../s3/s3-lib";
import { AnyObject, ReportType, State } from "../types";

/**
 *
 * @param reportBucket bucket name
 * @param state state
 * @param copyFieldDataSourceId fieldDataId of source report
 * @param formTemplate form template json object
 * @param validatedFieldData validated field data from request
 */
export async function copyFieldDataFromSource(
  reportBucket: string,
  state: string | undefined,
  copyFieldDataSourceId: any,
  formTemplate: any,
  validatedFieldData: AnyObject,
  reportType: ReportType
) {
  // Year-over-year copy is currently only supported for MCPAR and NAAAR
  let fieldsToCopy: AnyObject = mcparFieldsToCopy;
  if (reportType === ReportType.NAAAR) {
    fieldsToCopy = naaarFieldsToCopy;
  } else if (reportType !== ReportType.MCPAR) {
    return validatedFieldData;
  }

  const sourceFieldData = (await s3Lib.get({
    Bucket: reportBucket,
    Key: getFieldDataKey(state as State, copyFieldDataSourceId),
  })) as AnyObject;

  // If we couldn't find the data to copy, we will quietly do nothing
  if (!sourceFieldData) {
    return validatedFieldData;
  }

  // All fields in the current form template are valid. Additionally, entities have IDs and names that should be copied.
  const allowableFieldIds = getPossibleFieldsFromFormTemplate(
    formTemplate
  ).concat("id", "name", "isRequired");
  const rootFieldsToCopy = new Set(
    fieldsToCopy.root.filter((f: string) => allowableFieldIds.includes(f))
  );
  const entitiesToCopy = Object.keys(formTemplate.entities);

  for (const [rootKey, rootValue] of Object.entries(sourceFieldData)) {
    if (rootFieldsToCopy.has(rootKey)) {
      // If this is a root field, copy it directly
      validatedFieldData[rootKey] = rootValue;
    } else if (
      Array.isArray(fieldsToCopy[rootKey]) &&
      entitiesToCopy.includes(rootKey)
    ) {
      // If this is an entity array, copy each entity
      const entityFieldsToCopy = new Set<string>(
        fieldsToCopy[rootKey].filter((f: string) =>
          allowableFieldIds.includes(f)
        )
      );
      const copiedEntities = (rootValue as AnyObject[])
        .map((entity) => copyEntityData(entity, entityFieldsToCopy))
        .filter(nonEmptyObject);
      if (copiedEntities.length > 0) {
        // Don't copy empty arrays
        validatedFieldData[rootKey] = copiedEntities;
      }
    }
  }

  return validatedFieldData;
}

function copyEntityData(
  entityData: AnyObject,
  entityFieldsToCopy: Set<string>
) {
  const sourceEntries = Object.entries(entityData);
  const copyableEntries = sourceEntries.filter(([key, _]) =>
    entityFieldsToCopy.has(key)
  );
  return Object.fromEntries(copyableEntries);
}

function nonEmptyObject(obj: AnyObject) {
  return Object.keys(obj).length > 0;
}

export function makePCCMModifications(fieldData: any) {
  // Section C.I, Question C1.I.3 Program type; select PCCM option
  fieldData.program_type = [
    {
      key: "program_type-atiwcA9QUE2eoTchV2ZLtw", // pragma: allowlist secret
      value: "Primary Care Case Management (PCCM) Entity",
    },
  ];

  return fieldData;
}
