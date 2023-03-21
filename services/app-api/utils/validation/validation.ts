import * as yup from "yup";
import { nested, endDate, schemaMap, completionSchemaMap } from "./schemaMap";
import { AnyObject } from "../types/types";
import { error } from "../constants/constants";

// compare payload data against validation schema
export const validateData = async (
  validationSchema: AnyObject,
  data: AnyObject,
  options?: AnyObject
) => {
  try {
    // returns valid data to be passed through API
    return await validationSchema.validate(data, {
      stripUnknown: true,
      ...options,
    });
  } catch (e: any) {
    throw new Error(error.INVALID_DATA);
  }
};

// filter field validation to just what's needed for the passed fields
export const filterValidationSchema = (
  validationObject: AnyObject,
  data: AnyObject
): AnyObject => {
  const validationEntries = Object.entries(validationObject);
  const dataKeys = Object.keys(data);
  const filteredEntries = validationEntries.filter(
    (entry: [string, string | AnyObject]) => {
      const [entryKey] = entry;
      return dataKeys.includes(entryKey);
    }
  );
  return Object.fromEntries(filteredEntries);
};

// map field validation types to validation schema
export const mapValidationTypesToSchema = (
  fieldValidationTypes: AnyObject,
  isRequired: boolean = false
) => {
  let validationSchema: AnyObject = {};
  // for each field to be validated,
  let schemaMapper = isRequired ? completionSchemaMap : schemaMap;

  Object.entries(fieldValidationTypes).forEach(
    (fieldValidationType: [string, string | AnyObject]) => {
      const [key, fieldValidation] = fieldValidationType;
      // if standard validation type, set corresponding schema from map
      if (typeof fieldValidation === "string") {
        const correspondingSchema = schemaMapper[fieldValidation];
        if (correspondingSchema) {
          validationSchema[key] = correspondingSchema;
        }
      }
      // else if nested validation type, make and set nested schema
      else if (fieldValidation.nested) {
        validationSchema[key] = makeNestedFieldSchema(
          fieldValidation,
          isRequired
        );
        // else if not nested, make and set other dependent field types
      } else if (fieldValidation.type === "endDate") {
        validationSchema[key] = makeEndDateFieldSchema(
          fieldValidation,
          isRequired
        );
      }
    }
  );
  return validationSchema;
};

// return created endDate schema
export const makeEndDateFieldSchema = (
  fieldValidationObject: AnyObject,
  isRequired: boolean
) => {
  const { dependentFieldName } = fieldValidationObject;
  return isRequired
    ? endDate(dependentFieldName).required()
    : endDate(dependentFieldName);
};

// return created nested field schema
export const makeNestedFieldSchema = (
  fieldValidationObject: AnyObject,
  isRequired: boolean
) => {
  const { type, parentFieldName, parentOptionId } = fieldValidationObject;
  let schemaMapper = isRequired ? completionSchemaMap : schemaMap;
  if (fieldValidationObject.type === "endDate") {
    return nested(
      () => makeEndDateFieldSchema(fieldValidationObject, isRequired),
      parentFieldName,
      parentOptionId
    );
  } else {
    const fieldValidationSchema = schemaMapper[type];
    let nestedSchema = nested(
      () => fieldValidationSchema,
      parentFieldName,
      parentOptionId
    );
    if (isRequired) nestedSchema = nestedSchema.required();
    return nestedSchema;
  }
};

export const validateFieldData = async (
  validationJson: AnyObject,
  unvalidatedFieldData: AnyObject,
  isRequired: boolean = false
) => {
  let validatedFieldData: AnyObject | undefined = undefined;
  // filter field validation to just what's needed for the passed fields
  const filteredFieldDataValidationJson = filterValidationSchema(
    validationJson,
    unvalidatedFieldData
  );
  // transform field validation instructions to yup validation schema
  const fieldDataValidationSchema = yup
    .object()
    .shape(
      mapValidationTypesToSchema(filteredFieldDataValidationJson, isRequired)
    );
  if (fieldDataValidationSchema) {
    validatedFieldData = await validateData(
      fieldDataValidationSchema,
      unvalidatedFieldData
    );
  }
  return validatedFieldData;
};
