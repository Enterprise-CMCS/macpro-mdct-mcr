import * as yup from "yup";
import { error } from "../constants/constants";
// types
import { AnyObject, ValidationType } from "../types";
// utils
import {
  completionSchemaMap as schemaMap,
  endDate,
  endDateOptional,
  nested,
} from "./completionSchemas";

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
      const getSchema = dependentSchemas[fieldValidation.type];
      if (getSchema) {
        validationSchema[key] = getSchema(fieldValidation);
      }
    }
  );
  return validationSchema;
};

// return created nested field schema
export const makeNestedFieldSchema = (fieldValidationObject: AnyObject) => {
  const { type, parentFieldName, parentOptionId } = fieldValidationObject;
  const getSchema = dependentSchemas[type];
  if (getSchema) {
    return nested(
      () => getSchema(fieldValidationObject),
      parentFieldName,
      parentOptionId
    );
  } else {
    const fieldValidationSchema = schemaMap[type];
    return nested(() => fieldValidationSchema, parentFieldName, parentOptionId);
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
  } catch {
    throw new Error(error.INVALID_DATA);
  }
};
