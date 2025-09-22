import { validNAValues } from "utils";

export const goodNumberTestCases = [
  "123",
  "123.00",
  "123.00",
  "1,230",
  "1,2,30",
  "1230",
  "123450123,,,.123123123123",
  ...validNAValues,
];

export const goodPositiveNumberTestCases = [
  "123",
  "123.00",
  "123.00",
  "1,230",
  "1,2,30",
  "1230",
  "123450123,,,.123123123123",
  ...validNAValues,
];

export const negativeNumberTestCases = [
  "-123",
  "-123.00",
  "-123.00",
  "-1,230",
  "-1,2,30",
  "-1230",
  "-123450123,,,.123123123123",
];

export const zeroTest = ["0", "0.0"];

export const badNumberTestCases = ["abc", "N", "", "!@#!@%"];

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

export const goodDateOptionalTestCases = ["", "01/01/2023", "05/15/2023"];

export const badDateOptionalTestCases = [
  1,
  "Hello!",
  "1/1/2",
  "0/0/99",
  "0/01/2023",
  "42/42/4242",
];

//Creates dates in the format of mm/dd/yyyy
const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

export const goodValidDateTestCases = ["01/01/2023", "05/15/2023"];

export const badValidDateTestCases = ["02/30/2023", "09/31/2023"];

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

export const goodRequiredTextTestCases = ["a", " a ", ".", "string"];
export const goodOptionalTextTestCases = ["", ...goodRequiredTextTestCases];
export const badRequiredTextTestCases = ["", "   ", undefined];
