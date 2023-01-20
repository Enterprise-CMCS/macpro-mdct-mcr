import {
  array,
  boolean,
  mixed,
  number as numberSchema,
  object,
  string,
  StringSchema,
} from "yup";

const error = {
  INVALID_EMAIL: "Response must be a valid email address",
  INVALID_URL: "Response must be a valid hyperlink/URL",
  INVALID_DATE: "Response must be a valid date",
  INVALID_END_DATE: "End date can't be before start date",
  INVALID_NUMBER_OR_NA: 'Response must be a valid number or "N/A"',
  INVALID_RATIO: "Response must be a valid ratio",
};

// TEXT
export const text = (): StringSchema => string();
export const textOptional = () => text();

// NUMBER - Helpers
const validNAValues = ["N/A", "Data not available"];

const valueCleaningNumberSchema = (value: string, charsToReplace: RegExp) => {
  return numberSchema().transform((_value) => {
    return Number(value.replace(charsToReplace, ""));
  });
};

// NUMBER - Number or Valid Strings
export const number = () =>
  string().test({
    message: error.INVALID_NUMBER_OR_NA,
    test: (value) => {
      const validNumberRegex = /[0-9,.]/;
      if (value) {
        const isValidStringValue = validNAValues.includes(value);
        const isValidNumberValue = validNumberRegex.test(value);
        return isValidStringValue || isValidNumberValue;
      } else return true;
    },
  });
export const numberOptional = () => number();

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
    test: (value) => !!value?.match(dateFormatRegex) || value === "",
  });

export const dateOptional = () => date();
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
export const dropdown = () => object({ label: text(), value: text() });

// CHECKBOX
export const checkbox = () =>
  array()
    .min(0)
    .of(object({ key: text(), value: text() }));
export const checkboxOptional = () => checkbox();
export const checkboxSingle = () => boolean();

// RADIO
export const radio = () =>
  array()
    .min(0)
    .of(object({ key: text(), value: text() }));
export const radioOptional = () => radio();

// DYNAMIC
export const dynamic = () => array().min(0).of(mixed());
export const dynamicOptional = () => dynamic();

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

// SCHEMA MAP
export const schemaMap: any = {
  checkbox: checkbox(),
  checkboxOptional: checkboxOptional(),
  checkboxSingle: checkboxSingle(),
  date: date(),
  dateOptional: dateOptional(),
  dropdown: dropdown(),
  dynamic: dynamic(),
  dynamicOptional: dynamicOptional(),
  email: email(),
  emailOptional: emailOptional(),
  number: number(),
  numberOptional: numberOptional(),
  objectArray: objectArray(),
  radio: radio(),
  radioOptional: radioOptional(),
  ratio: ratio(),
  text: text(),
  textOptional: textOptional(),
  url: url(),
  urlOptional: urlOptional(),
};
