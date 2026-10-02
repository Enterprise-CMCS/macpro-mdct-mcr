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
// types
import { Choice, ChoiceOptions } from "../types";

const error = {
  REQUIRED_GENERIC: "A response is required",
  REQUIRED_CHECKBOX: "Select at least one response",
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_DATE: "Response must be a valid date",
  INVALID_END_DATE: "End date can't be before start date",
  INVALID_FUTURE_DATE: "Response must be today's date or in the future",
  INVALID_PAST_DATE: "Response must be before today's date",
  NUMBER_LESS_THAN_ONE: "Response must be greater than or equal to one",
  NUMBER_LESS_THAN_ZERO: "Response must be greater than or equal to zero",
  INVALID_NUMBER: "Response must be a valid number",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number, "N/A" or "NR"',
  INVALID_RATIO: "Response must be a valid ratio",
  NA_NOT_ACCEPTED:
    "Enter a valid response. N/A and other placeholder text are not accepted for this item.",
  POSITIVE_NUMBER_REQUIRED: "Enter a valid numeric response greater than 0.",
  INTEGER_ZERO_OR_GREATER_REQUIRED: "Enter a valid numeric response.",
  PERCENTAGE_RANGE_REQUIRED: "Enter a value between 0 and 100.",
  DATE_YEAR_2000_OR_LATER: "Enter a date in 2000 or later.",
  EMAIL_OR_URL_REQUIRED:
    "Response must include a valid hyperlink/URL or email address.",
  URL_LIST_REQUIRED: "Response must include one or more valid hyperlinks/URLs.",
};

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

export const numberOrSuppressed = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => {
        if (!value) return false;
        const isSuppressed = value.trim().toLowerCase() === "suppressed";
        return isSuppressed || validNumberRegex.test(value);
      },
      message: error.INVALID_NUMBER,
    });

const validNumberSchema = () =>
  string().test({
    message: error.INVALID_NUMBER,
    test: (value) => {
      return value === undefined ? false : validNumberRegex.test(value);
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
      return validNumberRegex.test(value);
    },
  });

export const validNumberNoNA = () => validNumberNoNASchema();

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

export const textNoNA = () => textNoNASchema();

export const textNoNAOptional = () => textNoNASchema().nullable();

export const positiveNumberNoNA = (options?: ChoiceOptions) =>
  string().test({
    message: options?.errorMessage ?? error.POSITIVE_NUMBER_REQUIRED,
    test: (value) => {
      if (!value || isWhitespaceString(value)) return true;
      if (!isStrictlyNumeric(value)) return false;
      return Number(stripNumberFormatting(value)) > 0;
    },
  });

export const integerZeroOrGreaterNoNA = (options?: ChoiceOptions) =>
  string().test({
    message: options?.errorMessage ?? error.INTEGER_ZERO_OR_GREATER_REQUIRED,
    test: (value) => {
      if (!value || isWhitespaceString(value)) return true;
      return /^\d+$/.test(stripNumberFormatting(value));
    },
  });

export const percentageZeroToHundredNoNA = () =>
  string().test({
    message: error.PERCENTAGE_RANGE_REQUIRED,
    test: (value) => {
      if (!value || isWhitespaceString(value)) return true;
      if (!isStrictlyNumeric(value)) return false;
      const num = Number(stripNumberFormatting(value));
      return num >= 0 && num <= 100;
    },
  });

export const dateYear2000OrLater = () =>
  string()
    .test({
      message: error.INVALID_DATE,
      test: (value) => !value || dateFormatRegex.test(value),
    })
    .test({
      message: error.DATE_YEAR_2000_OR_LATER,
      test: (value) => {
        if (!value) return true;
        const year = value.includes("/")
          ? Number(value.split("/")[2])
          : Number(value.substring(4));
        return year >= 2000;
      },
    });

const emailOrUrlItemRegex = /^[^\s@]+@[^\s@]+\.\S+$|^https?:\/\/\S+$/i;

export const emailOrUrlNoNA = () =>
  string().test({
    message: error.EMAIL_OR_URL_REQUIRED,
    test: (value) => {
      if (!value || isWhitespaceString(value)) return true;
      return value
        .split(",")
        .map((item) => item.trim())
        .every((item) => item.length > 0 && emailOrUrlItemRegex.test(item));
    },
  });

export const urlList = () =>
  string().test({
    message: error.URL_LIST_REQUIRED,
    test: (value) => {
      if (!value) return true;
      return value
        .split(",")
        .map((item) => item.trim())
        .every((item) => text().url().isValidSync(item));
    },
  });

export const numberOrSuppressedNoNA = () =>
  string().test({
    test: (value) => {
      if (!value) return true;
      const isSuppressed = value.trim().toLowerCase() === "suppressed";
      if (validNAValues.includes(value)) return false;
      return isSuppressed || validNumberRegex.test(value);
    },
    message: error.NA_NOT_ACCEPTED,
  });

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
        ratio[0].trim().length === 0 ||
        ratio[1].trim().length === 0
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
      return isEndDateAfterStartDate(
        context.parent[startDateField],
        endDateString as string
      );
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
export const checkboxCustom = (options: ChoiceOptions) =>
  array()
    .min(1, options.errorMessage ?? error.REQUIRED_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .required(options.errorMessage ?? error.REQUIRED_CHECKBOX);
export const checkboxOptional = () =>
  array()
    .of(object({ key: text(), value: text() }))
    .notRequired()
    .nullable();
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
export const dynamic = (min = 1) =>
  array()
    .min(min)
    // Plans and BSS entities add fields other than id/name,
    // mixed() allows them without explicit validation
    .of(mixed())
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = () => dynamic(0).notRequired().nullable();

// data acceptance: only validate the array shape, not entity name content;
// "N/A"/placeholder name rejection is enforced at completion-status time
// instead (completionSchemas.ts), so saving a draft name doesn't 400
export const dynamicNoPlaceholder = (min = 1) => dynamic(min);

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

// OBJECT ARRAY
export const objectArray = () => array().of(mixed());

// REGEX
const datePattern = String.raw`((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})`;
const dateMonthYearPattern = String.raw`(\d{2}\/\d{4}|\d{6})`;
export const dateFormatRegex = new RegExp(`^${datePattern}$`);
export const dateMonthYearFormatRegex = new RegExp(`^${dateMonthYearPattern}$`);
export const optionalDateFormatRegex = new RegExp(`^(${datePattern})?$`);

// SCHEMA MAP
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
  integerZeroOrGreaterNoNA: (options?: ChoiceOptions) =>
    integerZeroOrGreaterNoNA(options),
  number: number(),
  numberNotLessThanOne: numberNotLessThanOne(),
  numberNotLessThanZero: numberNotLessThanZero(),
  numberNotLessThanZeroOptional: numberNotLessThanZeroOptional(),
  numberOptional: numberOptional(),
  numberOrSuppressed: numberOrSuppressed(),
  numberOrSuppressedNoNA: numberOrSuppressedNoNA(),
  numberSuppressible: numberSuppressible(),
  objectArray: objectArray(),
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
