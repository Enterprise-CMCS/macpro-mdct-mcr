import { nested, endDate } from "./schemas";
import { schemaMap } from "./schemaMap";
import { AnyObject } from "../types/types";
import { VALIDATION_ERROR_MESSAGE } from "../constants/constants";

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
    console.log("VALIDATION ERRORS", e); // eslint-disable-line no-console
    throw new Error(VALIDATION_ERROR_MESSAGE);
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
  const { type, parentFieldName, visibleOptionValue } = fieldValidationObject;
  if (fieldValidationObject.type === "endDate") {
    return nested(
      () => makeEndDateFieldSchema(fieldValidationObject),
      parentFieldName,
      visibleOptionValue
    );
  } else {
    const fieldBaseSchema = schemaMap[type];
    return nested(() => fieldBaseSchema, parentFieldName, visibleOptionValue);
  }
};
