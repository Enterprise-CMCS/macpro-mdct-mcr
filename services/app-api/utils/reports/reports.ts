import { MCPARFieldIDBlocklist } from "../constants/constants";
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
  const sourceFieldData = (await s3Lib.get({
    Bucket: reportBucket,
    Key: getFieldDataKey(state as State, copyFieldDataSourceId),
  })) as AnyObject;

  if (sourceFieldData && reportType === ReportType.MCPAR) {
    const possibleFields = getPossibleFieldsFromFormTemplate(formTemplate);
    Object.keys(sourceFieldData).forEach((key: string) => {
      if (
        MCPARFieldIDBlocklist.wildcard.some((x) =>
          key.toLowerCase().includes(x)
        )
      ) {
        delete sourceFieldData[key];
      } else if (Array.isArray(sourceFieldData[key])) {
        // Only iterate through entities, not choice lists
        pruneEntityData(
          sourceFieldData,
          key,
          sourceFieldData[key],
          possibleFields
        );
      } else if (
        !possibleFields.includes(key) ||
        MCPARFieldIDBlocklist.matchString.includes(key)
      ) {
        delete sourceFieldData[key];
      }
    });
    Object.assign(validatedFieldData, sourceFieldData);
  }
  return validatedFieldData;
}
function pruneEntityData(
  sourceFieldData: AnyObject,
  key: string,
  entityData: AnyObject[],
  possibleFields: string[]
) {
  entityData.forEach((entity, index) => {
    // TODO: there has to be a better way to write this
    if (
      entity.key?.includes(
        "state_excludedEntityIdentifiedInFederalDatabaseCheck"
      ) ||
      entity.key?.includes("program_prohibitedAffiliationDisclosure")
    ) {
      delete entityData[index];
    }
    // Delete any key existing in the source data not valid in our template, or any entity key that's not a name.
    Object.keys(entity).forEach((entityKey) => {
      // Entities have "name" and "id" keys that are not accounted for in the form JSON. This carveout ensures we never remove them.
      if (
        !["key", "value", "name", "id"].includes(entityKey) &&
        (!possibleFields.includes(entityKey) ||
          MCPARFieldIDBlocklist.matchString.includes(entityKey) ||
          MCPARFieldIDBlocklist.wildcard.some((x) =>
            entityKey.toLowerCase().includes(x)
          ))
      ) {
        delete entityData[index][entityKey];
      }
    });
    if (Object.keys(entity).length === 0) {
      delete entityData[index];
    }
  });
  // Delete whole key if there's nothing in it.
  if (entityData.every((e) => e === null)) {
    delete sourceFieldData[key];
  }
}
