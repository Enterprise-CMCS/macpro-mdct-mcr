import { validNAValues as validNACompletionValues } from "../../validation/completionSchemas";
import { validNAValues } from "../../validation/schemaMap";

export const goodNumberTestCases = [
  "",
  "123",
  "123.00",
  "123..00",
  "1,230",
  "1,2,30",
  "1230",
  "123450123..,,,.123123123123",
  ...validNAValues,
];
export const badNumberTestCases = ["abc", "N", "!@#!@%"];

export const goodNumberCompletionTestCases = [
  "123",
  "123.00",
  "123..00",
  "1,230",
  "1,2,30",
  "1230",
  "123450123..,,,.123123123123",
  ...validNACompletionValues,
];
export const badNumberCompletionTestCases = ["abc", "N", "", "!@#!@%"];

export const zeroTest = ["0", "0.0"];

export const goodPositiveNumberTestCases = [
  "123",
  "123.00",
  "123..00",
  "1,230",
  "1,2,30",
  "1230",
  "123450123..,,,.123123123123",
];

export const negativeNumberTestCases = [
  "-123",
  "-123.00",
  "-123..00",
  "-1,230",
  "-1,2,30",
  "-1230",
  "-123450123..,,,.123123123123",
];

export const goodRatioTestCases = [
  "1:1",
  "123:123",
  "1,234:1.12",
  "0:1",
  "1:10,000",
];

export const badRatioTestCases = [
  ":",
  ":1",
  "1:",
  "1",
  "1234",
  "abc",
  "N/A",
  "abc:abc",
  ":abc",
  "abc:",
  "%@#$!ASDF",
];

export const goodDateTestCases = ["01/01/1990", "12/31/2020", "01012000"];
export const badDateTestCases = ["01-01-1990", "13/13/1990", "12/32/1990"];

//Creates dates in the format of mm/dd/yyyy
const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

export const goodFutureDateTestCases = [
  dateTimeFormat.format(new Date()), //Todays Date
  dateTimeFormat.format(new Date(new Date().setDate(new Date().getDate() + 1))), //Tomorrows Date
  "12/29/2095", //Will eventually fail in 70 years but if it does we've got bigger problems.
];

export const badFutureDateTestCases = [
  "",
  "1/2",
  "0/0/99",
  "0/01/2023",
  "42/42/4242",
  dateTimeFormat.format(new Date(new Date().setDate(new Date().getDate() - 1))), //Yesterdays Date
];

export const goodValidNumberTestCases = [1, "1", "100000", "1,000,000"];
export const badValidNumberTestCases = ["N/A", "number", "foo"];

export const goodDropdownTestCases = [
  undefined,
  { label: "Select", value: "" },
  { label: "Select", value: "Actual value" },
];

export const badDropdownTestCases = [
  "",
  { label: "", value: "" },
  { label: "", value: "Actual value" },
  1,
  null,
];
