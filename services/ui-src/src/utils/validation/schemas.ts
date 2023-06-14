import {
  array,
  boolean,
  mixed,
  number as yupNumberSchema,
  object,
  string,
} from "yup";
import { validationErrors as error } from "verbiage/errors";
import { Choice } from "types";

// TEXT - Helpers
const isWhitespaceString = (value?: string) => value?.trim().length === 0;

// TEXT
export const text = () =>
  string()
    .typeError(error.INVALID_GENERIC)
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });
export const textOptional = () => string().typeError(error.INVALID_GENERIC);

// NUMBER - Helpers
const validNAValues = ["N/A", "Data not available"];

const valueCleaningNumberSchema = (value: string, charsToReplace: RegExp) => {
  return yupNumberSchema().transform((_value) => {
    return Number(value.replace(charsToReplace, ""));
  });
};

/**
 * We can afford to be very permissive with this regex. As long as the
 * value contains a digit, we can be confident that it ran through the
 * frontend masking logic. We also allow a single dot: if the user
 * types a dot, they are quite likely about to type a digit also.
 * We don't want to flash an angry error message before they do so.
 */
const validNumberRegex = /^\.$|[0-9]/;

// NUMBER - Number or Valid Strings
export const numberSchema = () =>
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

export const number = () =>
  numberSchema()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    });
export const numberOptional = () => numberSchema().notRequired().nullable();

export const numberPositive = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => !isWhitespaceString(value),
      message: error.REQUIRED_GENERIC,
    })
    .test({
      test: (value) => validNumberRegex.test(value!),
      message: error.INVALID_NUMBER,
    })
    .test({
      test: (value) => parseFloat(value!) > 0,
      message: error.NON_POSITIVE_NUMBER,
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
    });

export const dateOptional = () =>
  string()
    .nullable()
    .test({
      message: error.INVALID_DATE,
      test: (value) =>
        value === null ||
        value === undefined ||
        isWhitespaceString(value) ||
        dateFormatRegex.test(value),
    });

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

// CHECKBOX
export const checkbox = () =>
  array()
    .min(1, error.REQUIRED_CHECKBOX)
    .of(object({ key: text(), value: text() }))
    .required(error.REQUIRED_CHECKBOX);
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
export const dynamic = () =>
  array()
    .min(1)
    .of(
      object().shape({
        id: text(),
        name: text(),
      })
    )
    .required(error.REQUIRED_GENERIC);
export const dynamicOptional = () => dynamic().notRequired();

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
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
