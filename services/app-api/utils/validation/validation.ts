import * as yup from "yup";
import { nested, endDate, schemaMap } from "./schemaMap";
import { AnyObject } from "../types/types";
import error from "../constants/constants";

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
export const mapValidationTypesToSchema = (fieldValidationTypes: AnyObject) => {
  let validationSchema: AnyObject = {};
  // for each field to be validated,
  Object.entries(fieldValidationTypes).forEach(
    (fieldValidationType: [string, string | AnyObject]) => {
      const [key, fieldValidation] = fieldValidationType;
      // if standard validation type, set corresponding schema from map
      if (typeof fieldValidation === "string") {
        const correspondingSchema = schemaMap[fieldValidation];
        if (correspondingSchema) {
          validationSchema[key] = correspondingSchema;
        }
      }
      // else if nested validation type, make and set nested schema
      else if (fieldValidation.nested) {
        validationSchema[key] = makeNestedFieldSchema(fieldValidation);
        // else if not nested, make and set other dependent field types
      } else if (fieldValidation.type === "endDate") {
        validationSchema[key] = makeEndDateFieldSchema(fieldValidation);
      }
    }
  );
  return validationSchema;
};

// return created endDate schema
export const makeEndDateFieldSchema = (fieldValidationObject: AnyObject) => {
  const { dependentFieldName } = fieldValidationObject;
  return endDate(dependentFieldName);
};

// return created nested field schema
export const makeNestedFieldSchema = (fieldValidationObject: AnyObject) => {
  const { type, parentFieldName, parentOptionName } = fieldValidationObject;
  if (fieldValidationObject.type === "endDate") {
    return nested(
      () => makeEndDateFieldSchema(fieldValidationObject),
      parentFieldName,
      parentOptionName
    );
  } else {
    const fieldBaseSchema = schemaMap[type];
    return nested(() => fieldBaseSchema, parentFieldName, parentOptionName);
  }
};

export const validateFieldData = async (
  validationJson: AnyObject,
  unvalidatedFieldData: AnyObject
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
    .shape(mapValidationTypesToSchema(filteredFieldDataValidationJson));
  if (fieldDataValidationSchema) {
    validatedFieldData = await validateData(
      fieldDataValidationSchema,
      unvalidatedFieldData
    );
  }
  return validatedFieldData;
};
