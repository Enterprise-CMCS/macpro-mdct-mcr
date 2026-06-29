import {
  nested,
  endDate,
  pastDate,
  pastDateOptional,
  endDateOptional,
} from "./schemas";
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
       * undefined. Setting validation manually here if it's missing.
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
        return;
      }

      // if nested validation type, make and set nested schema
      if (fieldValidation.nested) {
        validationSchema[key] = makeNestedFieldSchema(fieldValidation);
        return;
      }

      // if not nested, make and set other dependent field types
      const dependentSchemas: AnyObject = {
        [ValidationType.END_DATE]: makeEndDateFieldSchema,
        [ValidationType.PAST_END_DATE]: makePastEndDateFieldSchema,
        [ValidationType.PAST_END_DATE_OPTIONAL]:
          makePastEndDateOptionalFieldSchema,
      };

      const getSchema = dependentSchemas[fieldValidation.type];
      if (getSchema) {
        validationSchema[key] = getSchema(fieldValidation);
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

export const makeEndDateOptionalFieldSchema = (
  fieldValidationObject: AnyObject
) => {
  const { dependentFieldName } = fieldValidationObject;
  return endDateOptional(dependentFieldName);
};

export const makePastEndDateFieldSchema = (
  fieldValidationObject: AnyObject
) => {
  // oxlint-disable-next-line unicorn/prefer-spread
  return makeEndDateFieldSchema(fieldValidationObject).concat(pastDate());
};

export const makePastEndDateOptionalFieldSchema = (
  fieldValidationObject: AnyObject
) => {
  // oxlint-disable-next-line unicorn/prefer-spread
  return makeEndDateOptionalFieldSchema(fieldValidationObject).concat(
    pastDateOptional()
  );
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
