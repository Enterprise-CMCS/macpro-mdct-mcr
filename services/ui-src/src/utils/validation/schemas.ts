import { array, boolean, mixed, object, string } from "yup";
// constants
import { suppressionText } from "../../constants";
// types
import { Choice, ChoiceOptions } from "types";
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

const placeholderValues = [
  "n/a",
  "na",
  "nr",
  "not applicable",
  "not available",
  "data not available",
  "data unavailable",
  "not reported",
  "no data",
  "no response",
  "not provided",
  "unknown",
  "null",
  "none",
  "tbd",
  "to be determined",
];
const isPlaceholderValue = (value: string) =>
  placeholderValues.includes(value.trim().toLowerCase());
const isPunctuationOnly = (value: string) => !/[a-zA-Z0-9]/.test(value);
const stripNumberFormatting = (value: string) =>
  value.replaceAll(",", "").trim();
const isStrictlyNumeric = (value: string) => {
  const cleaned = stripNumberFormatting(value);
  return cleaned !== "" && !Number.isNaN(Number(cleaned));
};

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

export const numberOrSuppressed = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (!value) return false;
        const isSuppressed = value.trim().toLowerCase() === "suppressed";
        return isSuppressed || checkStandardNumberInputAgainstRegexes(value);
      },
      message: error.INVALID_NUMBER_OR_SUPPRESSED,
    });

export const numberOrSuppressedOrNaNr = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (!value) return false;
        const isSuppressed = value.trim().toLowerCase() === "suppressed";
        const isValidNAValue = validNAValues.includes(value);
        return (
          isSuppressed ||
          isValidNAValue ||
          checkStandardNumberInputAgainstRegexes(value)
        );
      },
      message: error.INVALID_NUMBER_OR_SUPPRESSED_OR_NA_NR,
    });

const validNumberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER,
    test: (value) => {
      return value === undefined
        ? false
        : checkStandardNumberInputAgainstRegexes(value);
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

const validNumberNoNASchema = () =>
  string().test({
    message: error.NA_NOT_ACCEPTED,
    test: (value) => {
      if (!value) return true;
      if (validNAValues.includes(value)) return false;
      return checkStandardNumberInputAgainstRegexes(value);
    },
  });

export const validNumberNoNA = () =>
  validNumberNoNASchema()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });

export const validNumberNoNAOptional = () =>
  validNumberNoNASchema().notRequired().nullable();

const textNoNASchema = () =>
  string()
    .typeError(error.NA_NOT_ACCEPTED)
    .test({
      message: error.NA_NOT_ACCEPTED,
      test: (value) => {
        if (!value) return true;
        if (isWhitespaceString(value)) return false;
        if (isPlaceholderValue(value)) return false;
        if (isPunctuationOnly(value)) return false;
        return true;
      },
    });

export const textNoNA = () => textNoNASchema().required(error.NA_NOT_ACCEPTED);

export const textNoNAOptional = () => textNoNASchema().nullable();

export const positiveNumberNoNA = (options?: ChoiceOptions) =>
  string()
    .required(options?.errorMessage ?? error.POSITIVE_NUMBER_REQUIRED)
    .test({
      message: options?.errorMessage ?? error.POSITIVE_NUMBER_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        if (!isStrictlyNumeric(value)) return false;
        return Number(stripNumberFormatting(value)) > 0;
      },
    });

export const integerZeroOrGreaterNoNA = (options?: ChoiceOptions) =>
  string()
    .required(options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED)
    .test({
      message: options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        return /^\d+$/.test(stripNumberFormatting(value));
      },
    });

export const integerGreaterThanZeroNoNA = (options?: ChoiceOptions) =>
  string()
    .required(options?.errorMessage ?? error.POSITIVE_NUMBER_REQUIRED)
    .test({
      message: options?.errorMessage ?? error.POSITIVE_NUMBER_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        if (!/^\d+$/.test(stripNumberFormatting(value))) return false;
        return Number(stripNumberFormatting(value)) > 0;
      },
    });

export const numberZeroOrGreaterNoNA = (options?: ChoiceOptions) =>
  string()
    .required(options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED)
    .test({
      message: options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        if (!isStrictlyNumeric(value)) return false;
        return Number(stripNumberFormatting(value)) >= 0;
      },
    });

export const numberZeroOrGreaterTwoDecimalsNoNA = (options?: ChoiceOptions) =>
  string()
    .required(options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED)
    .test({
      message: options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        const cleaned = stripNumberFormatting(value);
        if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return false;
        return Number(cleaned) >= 0;
      },
    });

export const percentageZeroToHundredNoNA = () =>
  string()
    .required(error.PERCENTAGE_RANGE_REQUIRED)
    .test({
      message: error.PERCENTAGE_RANGE_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        if (!isStrictlyNumeric(value)) return false;
        const num = Number(stripNumberFormatting(value));
        return num >= 0 && num <= 100;
      },
    });

const emailOrUrlItemRegex = /^[^\s@]+@[^\s@]+\.\S+$|^https?:\/\/\S+$/i;

export const emailOrUrlNoNA = () =>
  string()
    .required(error.EMAIL_OR_URL_REQUIRED)
    .test({
      message: error.EMAIL_OR_URL_REQUIRED,
      test: (value) => {
        if (!value || isWhitespaceString(value)) return false;
        return value
          .split(",")
          .map((item) => item.trim())
          .every((item) => item.length > 0 && emailOrUrlItemRegex.test(item));
      },
    });

export const urlList = () =>
  string()
    .required(error.URL_LIST_REQUIRED)
    .test({
      message: error.URL_LIST_REQUIRED,
      test: (value) => {
        if (!value) return false;
        return value
          .split(",")
          .map((item) => item.trim())
          .every((item) => text().url().isValidSync(item));
      },
    });

export const numberOrSuppressedNoNA = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (!value) return false;
        const isSuppressed = value.trim().toLowerCase() === "suppressed";
        if (validNAValues.includes(value)) return false;
        return isSuppressed || checkStandardNumberInputAgainstRegexes(value);
      },
      message: error.NUMBER_OR_SUPPRESSED_NO_NA_REQUIRED,
    });

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

export const dateYear2000OrLater = () =>
  date().test({
    message: error.DATE_YEAR_2000_OR_LATER,
    test: (value) => {
      if (!value) return true;
      const year = value.includes("/")
        ? Number(value.split("/")[2])
        : Number(value.substring(4));
      return year >= 2000;
    },
  });

export const dateMonthYear = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .matches(dateMonthYearFormatRegex, error.INVALID_DATE_MONTH_YEAR)
    .test("is-valid-date", error.INVALID_DATE, (value) => {
      if (!value) return false;
      let month, year;
      if (value.includes("/")) {
        [month, year] = value.split("/");
      } else {
        month = value.substring(0, 2);
        year = value.substring(2);
      }
      month = Number(month);
      year = Number(year);

      const monthIndex = month - 1;
      const date = new Date(year, monthIndex, 1); // use arbitrary day 1 so we can validate month and year

      return date.getMonth() === monthIndex && date.getFullYear() === year;
    });

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

export const endDateOptional = (startDateField: string) =>
  dateOptional().test(
    "is-after-start-date-optional",
    error.INVALID_END_DATE,
    (endDateString, context) => {
      if (!endDateString) return true;

      const startDateString = context.parent[startDateField];
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
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

export const pastDate = () =>
  date().test(
    "is-before-current-date",
    error.INVALID_PAST_DATE,
    (dateString) => {
      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - 1);
      const inputtedDate = new Date(dateString!);
      return inputtedDate < todaysDate;
    }
  );

export const pastDateOptional = () =>
  dateOptional().test(
    "is-before-current-date-optional",
    error.INVALID_PAST_DATE,
    (dateString) => {
      if (!dateString) return true;

      const todaysDate = new Date();
      todaysDate.setDate(todaysDate.getDate() - 1);
      const inputtedDate = new Date(dateString);
      return inputtedDate < todaysDate;
    }
  );

// DROPDOWN
export const dropdown = () =>
  object({ label: text(), value: text() }).required(error.REQUIRED_GENERIC);
export const dropdownOptional = () =>
  object({ label: textOptional(), value: textOptional() }).notRequired();

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .required(error.REQUIRED_CHECKBOX);
export const checkboxCustom = (options: ChoiceOptions) =>
  array()
    .min(1, options.errorMessage ?? error.REQUIRED_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .required(options.errorMessage ?? error.REQUIRED_CHECKBOX);
export const checkboxOneOptional = () =>
  array()
    .max(1, error.REQUIRED_ONE_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .notRequired()
    .nullable();
export const checkboxOptional = () =>
  array()
    .of(object({ key: text(), value: text() }))
    .notRequired()
    .nullable();
export const checkboxSingle = () => boolean();

// RADIO
export const radioSchema = () =>
  array().of(object({ key: text(), value: text() }));
export const radio = () =>
  radioSchema().min(1, error.REQUIRED_GENERIC).required(error.REQUIRED_GENERIC);
export const radioOptional = () =>
  radioSchema().min(0, error.REQUIRED_GENERIC).notRequired().nullable();

// DYNAMIC
export const dynamic = (min = 1) =>
  array()
    .min(min)
    .of(
      object().shape({
        id: text(),
        name: text(),
      })
    )
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = () => dynamic(0).notRequired().nullable();

export const dynamicNoPlaceholder = (min = 1) =>
  array()
    .min(min)
    .of(
      object().shape({
        id: text(),
        name: textNoNA(),
      })
    )
    .required(error.REQUIRED_GENERIC);

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
  return baseSchema.when(
    parentFieldName,
    (value: Choice[]) =>
      // look for parentOptionId in checked choices
      value?.find((option: Choice) => option.key.endsWith(parentOptionId))
        ? fieldSchema() // returns standard field schema (required)
        : baseSchema // returns not-required Yup base schema
  );
};

// REGEX
const datePattern = String.raw`((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})`;
const dateMonthYearPattern = String.raw`(\d{2}\/\d{4}|\d{6})`;
export const dateFormatRegex = new RegExp(`^${datePattern}$`);
export const dateMonthYearFormatRegex = new RegExp(`^${dateMonthYearPattern}$`);
export const optionalDateFormatRegex = new RegExp(`^(${datePattern})?$`);

export const schemaMap: any = {
  checkbox: checkbox(),
  checkboxCustom: (options: ChoiceOptions) => checkboxCustom(options),
  checkboxOneOptional: checkboxOneOptional(),
  checkboxOptional: checkboxOptional(),
  checkboxSingle: checkboxSingle(),
  date: date(),
  dateMonthYear: dateMonthYear(),
  dateOptional: dateOptional(),
  dateYear2000OrLater: dateYear2000OrLater(),
  dropdown: dropdown(),
  dropdownOptional: dropdownOptional(),
  dynamic: dynamic(),
  dynamicOptional: dynamicOptional(),
  dynamicNoPlaceholder: dynamicNoPlaceholder(),
  email: email(),
  emailOptional: emailOptional(),
  emailOrUrlNoNA: emailOrUrlNoNA(),
  futureDate: futureDate(),
  integerGreaterThanZeroNoNA: (options?: ChoiceOptions) =>
    integerGreaterThanZeroNoNA(options),
  integerZeroOrGreaterNoNA: (options?: ChoiceOptions) =>
    integerZeroOrGreaterNoNA(options),
  number: number(),
  numberNotLessThanOne: numberNotLessThanOne(),
  numberNotLessThanZero: numberNotLessThanZero(),
  numberNotLessThanZeroOptional: numberNotLessThanZeroOptional(),
  numberOptional: numberOptional(),
  numberOrSuppressed: numberOrSuppressed(),
  numberOrSuppressedNoNA: numberOrSuppressedNoNA(),
  numberOrSuppressedOrNaNr: numberOrSuppressedOrNaNr(),
  numberSuppressible: numberSuppressible(),
  numberZeroOrGreaterNoNA: (options?: ChoiceOptions) =>
    numberZeroOrGreaterNoNA(options),
  numberZeroOrGreaterTwoDecimalsNoNA: (options?: ChoiceOptions) =>
    numberZeroOrGreaterTwoDecimalsNoNA(options),
  pastDate: pastDate(),
  pastDateOptional: pastDateOptional(),
  percentageZeroToHundredNoNA: percentageZeroToHundredNoNA(),
  positiveNumberNoNA: (options?: ChoiceOptions) => positiveNumberNoNA(options),
  radio: radio(),
  radioOptional: radioOptional(),
  ratio: ratio(),
  text: text(),
  textNoNA: textNoNA(),
  textNoNAOptional: textNoNAOptional(),
  textOptional: textOptional(),
  url: url(),
  urlList: urlList(),
  urlOptional: urlOptional(),
  validNumber: validNumber(),
  validNumberNoNA: validNumberNoNA(),
  validNumberNoNAOptional: validNumberNoNAOptional(),
  validNumberOptional: validNumberOptional(),
};
