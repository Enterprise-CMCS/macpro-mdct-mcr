import * as Yup from "yup";

// STRINGS

export const text = (
  nested?: string | boolean,
  parentFieldName?: string,
  parentOptionValue?: any
) =>
  // if nested, return nested schema
  nested && parentFieldName && parentOptionValue
    ? Yup.string().when(parentFieldName, {
        is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
        then: (schema: any) =>
          schema
            .required("A response is required")
            .typeError("Response must be valid"),
      })
    : // else return standard schema
      Yup.string()
        .required("A response is required")
        .typeError("Response must be valid");

export const number = () =>
  text().matches(numberFormatRegex, "Response must be a valid number");

export const email = () =>
  text().email("Response must be a valid email address");

export const url = () => text().url("Response must be a valid hyperlink/URL");

// DATES

export const date = () =>
  Yup.string()
    .required("A response is required")
    .matches(dateFormatRegex, "Response must be a valid date");

export const endDate = (startDateField: string) =>
  date().test(
    "is-after-start-date",
    "End date can't be before start date",
    (endDateString, context) => {
      const startDateString = context.parent[startDateField];
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString!);
      return endDate >= startDate;
    }
  );

// ARRAYS (checkbox, radio, dynamic)

export const checkbox = (
  nested?: string | boolean,
  parentFieldName?: string,
  parentOptionValue?: any
) =>
  // if nested, return nested schema
  nested && parentFieldName && parentOptionValue
    ? Yup.array().when(parentFieldName, {
        is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
        then: (schema: any) =>
          schema.min(1, "Select at least one response").of(text()),
      })
    : // else return standard schema
      Yup.array().min(1, "Select at least one response").of(text());

export const radio = (
  nested?: string | boolean,
  parentFieldName?: string,
  parentOptionValue?: any
) =>
  // if nested, return nested schema
  nested && parentFieldName && parentOptionValue
    ? Yup.array().when(parentFieldName, {
        is: (value: any) => value && value.indexOf(parentOptionValue) != -1,
        then: (schema: any) => schema.min(1).of(text()),
      })
    : // else return standard schema
      Yup.array().min(1).of(text());

export const dynamic = () => Yup.array().min(1).of(text());

// REGEX

export const numberFormatRegex =
  /^(?<!\S)(?=.)(0|([0-9,]*|\d{0,2}(,\d{3})*))?((\.\d*[0-9])|\.)?(?!\S)$/;

export const dateFormatRegex =
  /^((0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2})|((0[1-9]|1[0-2])(0[1-9]|1\d|2\d|3[01])(19|20)\d{2})$/;
