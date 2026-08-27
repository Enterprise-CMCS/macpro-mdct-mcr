import { endDate, endDateOptional, nested, schemaMap } from "./schemas";
import { AnyObject } from "types";
import { ValidationType } from "types/validations";

// return created endDate schema
const makeEndDateFieldSchema = (fieldValidationObject: AnyObject) => {
  const { dependentFieldName } = fieldValidationObject;
  return endDate(dependentFieldName);
};

const makeEndDateOptionalFieldSchema = (fieldValidationObject: AnyObject) => {
  const { dependentFieldName } = fieldValidationObject;
  return endDateOptional(dependentFieldName);
};

const makePastEndDateFieldSchema = (fieldValidationObject: AnyObject) => {
  // oxlint-disable-next-line unicorn/prefer-spread
  return makeEndDateFieldSchema(fieldValidationObject).concat(
    schemaMap.pastDate
  );
};

const makePastEndDateOptionalFieldSchema = (
  fieldValidationObject: AnyObject
) => {
  // oxlint-disable-next-line unicorn/prefer-spread
  return makeEndDateOptionalFieldSchema(fieldValidationObject).concat(
    schemaMap.pastDateOptional
  );
};

const dependentSchemas: AnyObject = {
  [ValidationType.END_DATE]: makeEndDateFieldSchema,
  [ValidationType.END_DATE_OPTIONAL]: makeEndDateOptionalFieldSchema,
  [ValidationType.PAST_END_DATE]: makePastEndDateFieldSchema,
  [ValidationType.PAST_END_DATE_OPTIONAL]: makePastEndDateOptionalFieldSchema,
};

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
      }
      // if standard validation type, set corresponding schema from map
      else if (typeof fieldValidation === "string") {
        const correspondingSchema = schemaMap[fieldValidation];
        if (correspondingSchema) {
          validationSchema[key] =
            typeof correspondingSchema === "function"
              ? correspondingSchema()
              : correspondingSchema;
        }
      }
      // else if custom validation type with options
      else if (fieldValidation?.options && !fieldValidation?.nested) {
        const correspondingSchema = schemaMap[fieldValidation.type];
        if (correspondingSchema) {
          validationSchema[key] = correspondingSchema(fieldValidation.options);
        }
      }
      // if nested validation type, make and set nested schema
      else if (fieldValidation?.nested) {
        validationSchema[key] = makeNestedFieldSchema(fieldValidation);
      }
      // if not nested, make and set other dependent field types
      else if (dependentSchemas[fieldValidation.type]) {
        const getSchema = dependentSchemas[fieldValidation.type];
        validationSchema[key] = getSchema(fieldValidation);
      }
    }
  );
  return validationSchema;
};

// return created nested field schema
export const makeNestedFieldSchema = (fieldValidationObject: AnyObject) => {
  const { options, type, parentFieldName, parentOptionId } =
    fieldValidationObject;
  const getSchema = dependentSchemas[type];
  if (getSchema) {
    return nested(
      () => getSchema(fieldValidationObject),
      parentFieldName,
      parentOptionId
    );
  } else {
    const correspondingSchema = schemaMap[type];
    const fieldValidationSchema =
      typeof correspondingSchema === "function"
        ? correspondingSchema(options)
        : correspondingSchema;
    return nested(() => fieldValidationSchema, parentFieldName, parentOptionId);
  }
};
