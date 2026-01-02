import { array, boolean, mixed, object, string } from "yup";
// constants
import { suppressionText } from "../../constants";
// types
import { Choice } from "types";
// utils
import {
  checkStandardNumberInputAgainstRegexes,
  checkRatioInputAgainstRegexes,
} from "utils/other/checkInputValidity";
// verbiage
import { validationErrors as error } from "verbiage/errors";

// TEXT - Helpers
const stringHasLength = (value?: string) => value?.length != 0;
const isWhitespaceString = (value?: string) => value?.trim().length === 0;
// valid if string is empty or not whitespace only
const isValidString = (value?: string) =>
  !(stringHasLength(value) && isWhitespaceString(value));

// TEXT
export const text = () =>
  string()
    .typeError(error.INVALID_GENERIC)
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => isValidString(value),
      message: error.REQUIRED_GENERIC,
    });
export const textOptional = () =>
  string()
    .typeError(error.INVALID_GENERIC)
    .test({
      test: (value) => isValidString(value),
      message: error.INVALID_GENERIC,
    });

// NUMBER - Helpers
const validNRValues = ["NR", "nr"];
export const validNAValues = [
  "N/A",
  "NA",
  "na",
  "n/a",
  "N/a",
  "Data not available",
  ...validNRValues,
];

// NUMBER - Number or Valid Strings
export const numberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER_OR_NA,
    test: (value) => {
      if (value) {
        const isValidStringValue = validNAValues.includes(value);
        const isValidNumberValue =
          checkStandardNumberInputAgainstRegexes(value);
        return isValidStringValue || isValidNumberValue;
      } else return true;
    },
  });

export const number = () =>
  numberSchema()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });

export const numberOptional = () => numberSchema().notRequired().nullable();

export const numberSuppressible = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (value === suppressionText) {
          return true;
        }
        return value ? checkStandardNumberInputAgainstRegexes(value) : false;
      },
      message: error.INVALID_NUMBER,
    });

const validNumberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER,
    test: (value) => {
      return typeof value !== "undefined"
        ? checkStandardNumberInputAgainstRegexes(value)
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

// NUMBER NOT LESS THAN ONE
export const numberNotLessThanOne = () =>
  number().test({
    test: (value) => {
      if (!value) return true;
      const isValidString = validNAValues.includes(value);
      const isGreaterThanOne = parseFloat(value) >= 1;
      return isValidString || isGreaterThanOne;
    },
    message: error.NUMBER_LESS_THAN_ONE,
  });

// NUMBER NOT LESS THAN ZERO
export const numberNotLessThanZero = () =>
  number().test({
    test: (value) => {
      if (!value) return true;
      const isValidString = validNAValues.includes(value);
      const isGreaterThanZero = parseFloat(value) >= 0;
      return isValidString || isGreaterThanZero;
    },
    message: error.NUMBER_LESS_THAN_ZERO,
  });

export const numberNotLessThanZeroOptional = () =>
  numberOptional().test({
    test: (value) => {
      if (!value) return true;
      const isValidString = validNAValues.includes(value);
      const isGreaterThanZero = parseFloat(value) >= 0;
      return isValidString || isGreaterThanZero;
    },
    message: error.NUMBER_LESS_THAN_ZERO,
  });

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
        return checkRatioInputAgainstRegexes(val).isValid;
      },
    });

// EMAIL
export const email = () => text().email(error.INVALID_EMAIL);
export const emailOptional = () => email().notRequired();

// URL
export const url = () => text().url(error.INVALID_URL);
export const urlOptional = () => url().notRequired();

// DATE
export const date = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .matches(dateFormatRegex, error.INVALID_DATE)
    .test({
      message: error.REQUIRED_GENERIC,
      test: (value) => !isWhitespaceString(value),
    })
    .test("is-valid-date", error.INVALID_DATE, (value) => {
      let result = false;
      if (value) {
        const date = new Date(value);
        let [month, day, year] = value.split("/");
        month = (parseInt(month) - 1).toString();
        if (
          date.getMonth() === parseInt(month) &&
          date.getDate() === parseInt(day) &&
          date.getFullYear() === parseInt(year)
        ) {
          result = true;
        }
      }
      return result;
    });

export const dateMonthYear = () =>
  string()
    .matches(dateMonthYearFormatRegex, error.INVALID_DATE_MONTH_YEAR)
    .required(error.REQUIRED_GENERIC);

export const dateOptional = () =>
  string().matches(optionalDateFormatRegex, error.INVALID_DATE).notRequired();

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

// DROPDOWN
export const dropdown = () =>
  object({ label: text(), value: text() }).required(error.REQUIRED_GENERIC);

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(object({ key: text(), value: text() }))
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
  array().of(object({ key: text(), value: text() }));
export const radio = () =>
  radioSchema().min(1, error.REQUIRED_GENERIC).required(error.REQUIRED_GENERIC);
export const radioOptional = () =>
  radioSchema().min(0, error.REQUIRED_GENERIC).notRequired().nullable();

// DYNAMIC
const dynamicSchema = () =>
  array().of(
    object().shape({
      id: text(),
      name: text().required(""),
    })
  );

export const dynamic = () =>
  dynamicSchema()
    .min(1, error.REQUIRED_GENERIC)
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = () =>
  dynamicSchema().min(0).notRequired().nullable();

// NESTED
export const nested = (
  fieldSchema: Function,
  parentFieldName: string,
  parentOptionId: string
) => {
  const fieldTypeMap = {
    array: array(),
    string: string(),
    object: object(),
    date: date(),
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
const datePattern =
  "((0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])\\/(19|20)\\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\\d|2\\d|3[01])(19|20)\\d{2})";
const dateMonthYearPattern = "(0[1-9]|1[0-2])\\/?(19|20)\\d{2}";
export const dateFormatRegex = new RegExp(`^${datePattern}$`);
export const dateMonthYearFormatRegex = new RegExp(`^${dateMonthYearPattern}$`);
export const optionalDateFormatRegex = new RegExp(`^(${datePattern})?$`);
