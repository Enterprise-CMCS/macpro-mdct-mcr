import { nested, endDate } from "./schemas";
import { schemaMap } from "./schemaMap";
import { AnyObject } from "types";

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
  const { type, parentFieldName, parentOptionId } = fieldValidationObject;
  if (fieldValidationObject.type === "endDate") {
    return nested(
      () => makeEndDateFieldSchema(fieldValidationObject),
      parentFieldName,
      parentOptionId
    );
  } else {
    const fieldBaseSchema = schemaMap[type];
    return nested(() => fieldBaseSchema, parentFieldName, parentOptionId);
  }
};
