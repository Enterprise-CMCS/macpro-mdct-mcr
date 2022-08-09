import { array, string } from "yup";
import { schemaValidationErrors as error } from "verbiage/errors";

// STRINGS

export const text = () =>
  string().required(error.REQUIRED_GENERIC).typeError(error.INVALID_GENERIC);

export const textOptional = () => string().typeError(error.INVALID_GENERIC);

export const number = () =>
  text().matches(numberFormatRegex, error.INVALID_NUMBER);

export const email = () => text().email(error.INVALID_EMAIL);

export const url = () => text().url(error.INVALID_URL);

export const urlOptional = () => textOptional().url(error.INVALID_URL);

// DATES

export const date = () =>
  string()
    .required(error.REQUIRED_GENERIC)
    .matches(dateFormatRegex, error.INVALID_DATE);

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

// ARRAYS (checkbox, radio, dynamic)

export const checkbox = () =>
  array()
    .required(error.REQUIRED_CHECKBOX)
    .min(1, error.REQUIRED_CHECKBOX)
    .of(text());

export const radio = () =>
  array().required(error.REQUIRED_GENERIC).min(1).of(text());

export const dynamic = () =>
  array().required(error.REQUIRED_GENERIC).min(1).of(text());

// NESTED

export const nested = (
  fieldSchema: Function,
  parentFieldName: string,
  parentOptionValue: any
) => {
  const fieldTypeMap = {
    array: array(),
    number: number(),
    string: string(),
  };
  const fieldType: keyof typeof fieldTypeMap = fieldSchema().type;
  const baseSchema: any = fieldTypeMap[fieldType];
  return baseSchema.when(parentFieldName, {
    is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
    then: () => fieldSchema(),
  });
};

// REGEX

export const numberFormatRegex =
  /^(?<!\S)(?=.)(0|([0-9,]*|\d{0,2}(,\d{3})*))?((\.\d*[0-9])|\.)?(?!\S)$/;

export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
