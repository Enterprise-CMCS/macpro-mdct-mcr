import {
  array,
  boolean,
  mixed,
  number as numberSchema,
  object,
  string,
} from "yup";
import { validationErrors as error } from "verbiage/errors";
import { Choice } from "types";

// TEXT
export const text = () =>
  string().typeError(error.INVALID_GENERIC).required(error.REQUIRED_GENERIC);
export const textOptional = () => text().notRequired();

// NUMBER - Helpers
const validNAValues = ["N/A", "Data not available"];

const ignoreCharsForSchema = (value: string, charsToReplace: RegExp) => {
  return numberSchema().transform((_value) => {
    return Number(value.replace(charsToReplace, ""));
  });
};

// NUMBER - Number or Valid Strings
export const number = () =>
  mixed()
    .test({
      message: error.REQUIRED_GENERIC,
      test: (val) => val != "",
    })
    .required(error.REQUIRED_GENERIC)
    .test({
      message: error.INVALID_NUMBER_OR_NA,
      test: (val) => {
        const replaceCharsRegex = /[,.]/g;
        return (
          ignoreCharsForSchema(val, replaceCharsRegex).isValidSync(val) ||
          validNAValues.includes(val)
        );
      },
    });
export const numberOptional = () => number().notRequired();

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
        const firstTest = ignoreCharsForSchema(
          ratio[0],
          replaceCharsRegex
        ).isValidSync(val);

        // Check if the right side of the ratio is a valid number
        const secondTest = ignoreCharsForSchema(
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
    .matches(dateFormatRegex, error.INVALID_DATE);
export const dateOptional = () => date().notRequired();
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
export const radio = () =>
  array()
    .min(1, error.REQUIRED_GENERIC)
    .of(object({ key: text(), value: text() }))
    .required(error.REQUIRED_GENERIC);
export const radioOptional = () => radio().notRequired();

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
    mixed: number(),
    string: string(),
    date: date(),
    object: object(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];

  return baseSchema.when(parentFieldName, {
    is: (value: Choice[]) =>
      // look for parentOptionId in checked choices
      value?.find((option: Choice) => option.key === parentOptionId),
    then: () => fieldSchema(),
  });
};

// REGEX
export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
