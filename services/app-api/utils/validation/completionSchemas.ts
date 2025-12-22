import {
  array,
  boolean,
  mixed,
  object,
  string,
  number as yupNumber,
} from "yup";
// constants
import { suppressionText } from "../constants/constants";
// types
import { Choice } from "../types";

export const error = {
  REQUIRED_GENERIC: "A response is required",
  REQUIRED_CHECKBOX: "Select at least one response",
  REQUIRED_ONE_CHECKBOX: "Select only one response",
  INVALID_GENERIC: "Response must be valid",
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_DATE: "Response must be a valid date",
  INVALID_END_DATE: "End date can't be before start date",
  NUMBER_LESS_THAN_ZERO: "Response must be greater than or equal to zero",
  NUMBER_LESS_THAN_ONE: "Response must be greater than or equal to one",
  INVALID_NUMBER: "Response must be a valid number",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number, "N/A" or "NR"',
  INVALID_RATIO: "Response must be a valid ratio",
};

// TEXT
const textSchema = () => string().typeError(error.INVALID_GENERIC);

export const text = () =>
  textSchema()
    .test({
      test: (value) => value?.trim().length !== 0,
      message: error.REQUIRED_GENERIC,
    })
    .required();
export const textOptional = () => textSchema().nullable();

// NUMBER - Helpers
export const validNAValues = [
  "N/A",
  "NA",
  "na",
  "n/a",
  "N/a",
  "Data not available",
  "NR",
  "nr",
];

/** This regex must be at least as permissive as the one in ui-src */
const validNumberRegex = /^\.$|[0-9]/;

// NUMBER - Number or Valid Strings
const numberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER_OR_NA,
    test: (value) => {
      if (value) {
        const isValidStringValue = validNAValues.includes(value);
        const isValidNumberValue = validNumberRegex.test(value);
        return isValidStringValue || isValidNumberValue;
      } else return true;
    },
  });

// NUMBER NOT LESS THAN ONE
export const numberNotLessThanOne = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) =>
        (validNumberRegex.test(value!) && parseFloat(value!) >= 1) ||
        validNAValues.includes(value!),
      message: error.INVALID_NUMBER,
    });

// NUMBER NOT LESS THAN ZERO
export const numberNotLessThanZero = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (!value) return true;
        return (
          (validNumberRegex.test(value!) && parseFloat(value!) >= 0) ||
          validNAValues.includes(value!)
        );
      },
      message: error.INVALID_NUMBER,
    });

export const numberNotLessThanZeroOptional = () =>
  numberNotLessThanZero().notRequired().nullable();

const valueCleaningNumberSchema = (value: string, charsToReplace: RegExp) => {
  return yupNumber().transform((_value) => {
    return Number(value.replace(charsToReplace, ""));
  });
};

export const number = () => numberSchema().required();
export const numberOptional = () => numberSchema().notRequired().nullable();

export const numberSuppressible = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (value === suppressionText) {
          return true;
        }
        return value
          ? validNumberRegex.test(value) || validNAValues.includes(value!)
          : false;
      },
      message: error.INVALID_NUMBER,
    });

const validNumberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER,
    test: (value) => {
      if (!value) return true;
      return validNumberRegex.test(value!);
    },
  });

export const validNumber = () =>
  validNumberSchema().required(error.REQUIRED_GENERIC);

export const validNumberOptional = () =>
  validNumberSchema().notRequired().nullable();

// Number - Ratio
export const ratio = () =>
  mixed()
    .test({
      message: error.REQUIRED_GENERIC,
      test: (val) => val != "",
    })
    .required(error.REQUIRED_GENERIC)
    .test({
      message: error.INVALID_RATIO,
      test: (val) => {
        const replaceCharsRegex = /[,.:]/g;
        const ratio = val?.split(":");

        // Double check and make sure that a ratio contains numbers on both sides
        if (
          !ratio ||
          ratio.length != 2 ||
          ratio[0].trim().length == 0 ||
          ratio[1].trim().length == 0
        ) {
          return false;
        }

        // Check if the left side of the ratio is a valid number
        const firstTest = valueCleaningNumberSchema(
          ratio[0],
          replaceCharsRegex
        ).isValidSync(val);

        // Check if the right side of the ratio is a valid number
        const secondTest = valueCleaningNumberSchema(
          ratio[1],
          replaceCharsRegex
        ).isValidSync(val);

        // If both sides are valid numbers, return true!
        return firstTest && secondTest;
      },
    });

// EMAIL

export const email = () => textSchema().email(error.INVALID_EMAIL).required();
export const emailOptional = () =>
  textSchema().email(error.INVALID_EMAIL).notRequired().nullable();

// URL
export const url = () => textSchema().url(error.INVALID_URL).required();
export const urlOptional = () =>
  textSchema().url(error.INVALID_URL).notRequired().nullable();

// DATE
const dateSchema = () =>
  string()
    .matches(dateFormatRegex, error.INVALID_DATE)
    .test("is-valid-date", error.INVALID_DATE, (value) => {
      // Allow null for optional date fields (note: required date fields are caught by required() in chain)
      if (!value) return true;
      const date = new Date(value);
      const [month, day, year] = value.split("/");
      return (
        date.getMonth() + 1 === parseInt(month) &&
        date.getDate() === parseInt(day) &&
        date.getFullYear() === parseInt(year)
      );
    });

export const dateMonthYear = () =>
  string().test({
    message: error.INVALID_DATE,
    test: (value) =>
      !!value?.match(dateMonthYearFormatRegex) || value?.trim() === "",
  });
export const date = () => dateSchema().required(error.REQUIRED_GENERIC);
export const dateOptional = () => dateSchema().notRequired().nullable();

export const endDate = (startDateField: string) =>
  date().test(
    "is-after-start-date",
    error.INVALID_END_DATE,
    (endDateString, context) => {
      const startDateString = context.parent[startDateField];
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString!);
      return endDate >= startDate;
    }
  );

// DROPDOWN
export const dropdown = () =>
  object({ label: text(), value: text() }).required(error.REQUIRED_GENERIC);

export const dropdownOptional = () =>
  mixed().test({
    message: error.INVALID_GENERIC,
    test: (val) => {
      switch (typeof val) {
        case "object":
          return object({ label: text(), value: string() })
            .required()
            .isValid(val);
        case "undefined":
          return true;
        default:
          return false;
      }
    },
  });

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(object({ key: textSchema(), value: textSchema() }))
    .required(error.REQUIRED_CHECKBOX);
export const checkboxOneOptional = () =>
  array()
    .max(1, error.REQUIRED_ONE_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .notRequired()
    .nullable();
export const checkboxOptional = () => checkbox().notRequired();
export const checkboxSingle = () => boolean();

// RADIO
export const radioSchema = () =>
  array()
    .of(object({ key: textSchema(), value: textSchema() }))
    .max(1);

export const radio = () =>
  radioSchema().length(1, error.REQUIRED_GENERIC).required();
export const radioOptional = () => radioSchema().notRequired().nullable();

// DYNAMIC
export const dynamic = () =>
  array()
    .min(1)
    .of(
      object().shape({
        id: textSchema(),
        name: textSchema(),
      })
    )
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = () => array().notRequired().nullable();

// NESTED
export const nested = (
  fieldSchema: Function,
  parentFieldName: string,
  parentOptionId: string
) => {
  const fieldTypeMap = {
    array: array(),
    string: string(),
    date: dateSchema(),
    object: object(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];
  return baseSchema.when(parentFieldName, {
    is: (value: Choice[]) =>
      // look for parentOptionId in checked choices
      value?.find((option: Choice) => option.key.endsWith(parentOptionId)),
    then: () => fieldSchema(), // returns standard field schema (required)
    otherwise: () => baseSchema, // returns not-required Yup base schema
  });
};

// REGEX
export const dateFormatRegex =
  /^$|^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
export const dateMonthYearFormatRegex =
  /^((0[1-9]|1[0-2])\/(19|20)\d{2})|((0[1-9]|1[0-2])(19|20)\d{2})|\s$/;
