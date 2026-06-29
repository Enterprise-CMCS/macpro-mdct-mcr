import { nested, endDate, pastDate } from "./schemas";
import { schemaMap } from "./schemaMap";
import { AnyObject } from "types";
import { ValidationType } from "types/validations";

// map field validation types to validation schema
export const mapValidationTypesToSchema = (fieldValidationTypes: AnyObject) => {
  let validationSchema: AnyObject = {};
  // for each field to be validated,
  Object.entries(fieldValidationTypes).forEach(
    (fieldValidationType: [string, string | AnyObject]) => {
      const [key, fieldValidation] = fieldValidationType;
      /**
       * Legacy: These MLR form fields were created initially without validation
       * because they are auto-populated. To keep the form fields standard, they
       * now have validation but older forms will fail because fieldValidation is
       * undefined. Setting validation manually here.
       */
      if (
        [
          "report_reportingPeriodStartDate",
          "report_reportingPeriodEndDate",
        ].includes(key) &&
        !fieldValidation
      ) {
        validationSchema[key] = schemaMap[ValidationType.DATE_OPTIONAL];
        return;
      }

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
      } else if (fieldValidation.type === ValidationType.END_DATE) {
        validationSchema[key] = makeEndDateFieldSchema(fieldValidation);
      } else if (fieldValidation.type === ValidationType.PAST_END_DATE) {
        validationSchema[key] = makePastEndDateFieldSchema(fieldValidation);
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

export const makePastEndDateFieldSchema = (
  fieldValidationObject: AnyObject
) => {
  // oxlint-disable-next-line unicorn/prefer-spread
  return makeEndDateFieldSchema(fieldValidationObject).concat(pastDate());
};

// return created nested field schema
export const makeNestedFieldSchema = (fieldValidationObject: AnyObject) => {
  const { type, parentFieldName, parentOptionId } = fieldValidationObject;
  if (type === ValidationType.END_DATE) {
    return nested(
      () => makeEndDateFieldSchema(fieldValidationObject),
      parentFieldName,
      parentOptionId
    );
  } else {
    const fieldValidationSchema = schemaMap[type];
    return nested(() => fieldValidationSchema, parentFieldName, parentOptionId);
  }
};
