import { array, string } from "yup";
import { SCHEMA_VALIDATION_ERRORS as ERROR } from "verbiage/errors";

// STRINGS

export const text = (parentFieldName?: string, parentOptionValue?: any) =>
  // if nested, return nested schema
  parentFieldName && parentOptionValue
    ? string().when(parentFieldName, {
        is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
        then: (schema: any) =>
          schema
            .required(ERROR.REQUIRED_GENERIC)
            .typeError(ERROR.INVALID_GENERIC),
      })
    : // else return standard schema
      string()
        .required(ERROR.REQUIRED_GENERIC)
        .typeError(ERROR.INVALID_GENERIC);

export const number = () =>
  text().matches(numberFormatRegex, ERROR.INVALID_NUMBER);

export const email = () => text().email(ERROR.INVALID_EMAIL);

export const url = () => text().url(ERROR.INVALID_URL);

// DATES

export const date = () =>
  string()
    .required(ERROR.REQUIRED_GENERIC)
    .matches(dateFormatRegex, ERROR.INVALID_DATE);

export const endDate = (startDateField: string) =>
  date().test(
    "is-after-start-date",
    ERROR.INVALID_END_DATE,
    (endDateString, context) => {
      const startDateString = context.parent[startDateField];
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString!);
      return endDate >= startDate;
    }
  );

// ARRAYS (checkbox, radio, dynamic)

export const checkbox = (parentFieldName?: string, parentOptionValue?: any) =>
  // if nested, return nested schema
  parentFieldName && parentOptionValue
    ? array().when(parentFieldName, {
        is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
        then: (schema: any) =>
          schema.min(1, ERROR.REQUIRED_CHECKBOX).of(text()),
      })
    : // else return standard schema
      array().min(1, ERROR.REQUIRED_CHECKBOX).of(text());

export const radio = (parentFieldName?: string, parentOptionValue?: any) =>
  // if nested, return nested schema
  parentFieldName && parentOptionValue
    ? array().when(parentFieldName, {
        is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
        then: (schema: any) => schema.min(1).of(text()),
      })
    : // else return standard schema
      array().min(1).of(text());

export const dynamic = () => array().min(1).of(text());

// REGEX

export const numberFormatRegex =
  /^(?<!\S)(?=.)(0|([0-9,]*|\d{0,2}(,\d{3})*))?((\.\d*[0-9])|\.)?(?!\S)$/;

export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
