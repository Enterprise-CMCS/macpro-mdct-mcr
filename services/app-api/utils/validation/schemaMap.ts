import {
  array,
  boolean,
  mixed,
  number as numberSchema,
  object,
  string,
  StringSchema,
} from "yup";
// constants
import { suppressionText } from "../constants/constants";

const error = {
  REQUIRED_GENERIC: "A response is required",
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_DATE: "Response must be a valid date",
  INVALID_END_DATE: "End date can't be before start date",
  INVALID_FUTURE_DATE: "Response must be today's date or in the future",
  NUMBER_LESS_THAN_ONE: "Response must be greater than or equal to one",
  NUMBER_LESS_THAN_ZERO: "Response must be greater than or equal to zero",
  INVALID_NUMBER: "Response must be a valid number",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number, "N/A" or "NR"',
  INVALID_RATIO: "Response must be a valid ratio",
};

const isWhitespaceString = (value?: string) => value?.trim().length === 0;

// TEXT
export const text = (): StringSchema => string();
export const textOptional = () => text();

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

const valueCleaningNumberSchema = (value: string, charsToReplace: RegExp) => {
  return numberSchema().transform((_value) => {
    return Number(value.replace(charsToReplace, ""));
  });
};

/** This regex must be at least as permissive as the one in ui-src */
const validNumberRegex = /^\.$|[0-9]/;

// NUMBER - Number or Valid Strings
export const number = () =>
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
      test: (value) => validNumberRegex.test(value!),
      message: error.INVALID_NUMBER,
    })
    .test({
      test: (value) => parseInt(value!) >= 1,
      message: error.NUMBER_LESS_THAN_ONE,
    });

// NUMBER NOT LESS THAN ZERO
export const numberNotLessThanZero = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => validNumberRegex.test(value!),
      message: error.INVALID_NUMBER,
    })
    .test({
      test: (value) => parseFloat(value!) >= 0,
      message: error.NUMBER_LESS_THAN_ZERO,
    });

export const numberNotLessThanZeroOptional = () => {
  numberNotLessThanZero().notRequired().nullable();
};

export const numberOptional = () => number();

export const numberSuppressible = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (value === suppressionText) {
          return true;
        }
        return value ? validNumberRegex.test(value) : false;
      },
      message: error.INVALID_NUMBER,
    });

const validNumberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER,
    test: (value) => {
      return typeof value !== "undefined"
        ? validNumberRegex.test(value)
        : false;
    },
  });

export const validNumber = () =>
  validNumberSchema()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });

export const validNumberOptional = () =>
  validNumberSchema().notRequired().nullable();

// Number - Ratio
export const ratio = () =>
  mixed().test({
    message: error.INVALID_RATIO,
    test: (val) => {
      // allow if blank
      if (val === "") return true;

      const replaceCharsRegex = /[,.:]/g;
      const ratio = val.split(":");

      // Double check and make sure that a ratio contains numbers on both sides
      if (
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
export const email = () => text().email(error.INVALID_EMAIL);
export const emailOptional = () => email();

// URL
export const url = () => text().url(error.INVALID_URL);
export const urlOptional = () => url();

// DATE
export const date = () =>
  string().test({
    message: error.INVALID_DATE,
    test: (value) => !!value?.match(dateFormatRegex) || value?.trim() === "",
  });

export const dateMonthYear = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .matches(dateMonthYearFormatRegex, error.INVALID_DATE)
    .test("is-valid-date", error.INVALID_DATE, (value) => {
      let result = false;
      if (!value) return result;
      let month, year;
      if (value.includes("/")) {
        [month, year] = value.split("/");
      } else {
        month = value.substring(0, 2);
        year = value.substring(2);
      }

      const date = new Date(`${month}/01/${year}`); // use arbitrary day to allow us to check the month and year
      month = (parseInt(month) - 1).toString();
      if (
        date.getMonth() === parseInt(month) &&
        date.getFullYear() === parseInt(year)
      ) {
        result = true;
      }
      return result;
    });

export const dateOptional = () => date();
export const endDate = (startDateField: string) =>
  date().test(
    "is-after-start-date",
    error.INVALID_END_DATE,
    (endDateString, context) => {
      return isEndDateAfterStartDate(
        context.parent[startDateField],
        endDateString as string
      );
    }
  );

export const futureDate = () =>
  date().test(
    "is-after-current-date",
    error.INVALID_FUTURE_DATE,
    (dateString) => {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - 1);
      const inputtedDate = new Date(dateString!);
      return inputtedDate >= todaysDate;
    }
  );

export const isEndDateAfterStartDate = (
  startDateString: string,
  endDateString: string
) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString!);
  return endDate >= startDate;
};

// DROPDOWN
export const dropdown = () => object({ label: text(), value: text() });
export const dropdownOptional = () =>
  object({
    label: text().notRequired().nullable(),
    value: text().notRequired().nullable(),
  });

// CHECKBOX
export const checkbox = () =>
  array()
    .min(0)
    .of(object({ key: text(), value: text() }));
export const checkboxOptional = () => checkbox();
export const checkboxSingle = () => boolean();
export const checkboxOneOptional = () =>
  array()
    .max(1)
    .of(object({ key: text(), value: text() }))
    .notRequired()
    .nullable();

// RADIO
export const radio = () =>
  array()
    .min(0)
    .of(object({ key: text(), value: text() }));
export const radioOptional = () => radio();

// DYNAMIC
export const dynamic = () => array().min(0).of(mixed());
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
    date: date(),
    object: object(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];
  return baseSchema.when(parentFieldName, {
    is: (value: any[]) =>
      // look for parentOptionId in checked Choices
      value?.find((option: any) => option.key === parentOptionId),
    then: () => fieldSchema(), // returns standard field schema (required)
    otherwise: () => baseSchema, // returns not-required Yup base schema
  });
};

// OBJECT ARRAY
export const objectArray = () => array().of(mixed());

// REGEX
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})|\s$/;
export const dateMonthYearFormatRegex = /^(\d{2}\/\d{4}|\d{6})$/;

// SCHEMA MAP
export const schemaMap: any = {
  checkbox: checkbox(),
  checkboxOneOptional: checkboxOneOptional(),
  checkboxOptional: checkboxOptional(),
  checkboxSingle: checkboxSingle(),
  date: date(),
  dateMonthYear: dateMonthYear(),
  dateOptional: dateOptional(),
  futureDate: futureDate(),
  dropdown: dropdown(),
  dropdownOptional: dropdownOptional(),
  dynamic: dynamic(),
  dynamicOptional: dynamicOptional(),
  email: email(),
  emailOptional: emailOptional(),
  number: number(),
  numberNotLessThanOne: numberNotLessThanOne(),
  numberNotLessThanZeroOptional: numberNotLessThanZeroOptional(),
  numberOptional: numberOptional(),
  numberSuppressible: numberSuppressible(),
  objectArray: objectArray(),
  radio: radio(),
  radioOptional: radioOptional(),
  ratio: ratio(),
  text: text(),
  textOptional: textOptional(),
  url: url(),
  urlOptional: urlOptional(),
};
