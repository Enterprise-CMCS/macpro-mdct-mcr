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

export const goodValidNumberTestCases = [1, "1", "100000", "1,000,000"];

export const badValidNumberTestCases = ["N/A", "number", "foo"];

export const goodRequiredTextTestCases = ["a", " a ", ".", "string"];
export const goodOptionalTextTestCases = ["", ...goodRequiredTextTestCases];
export const badRequiredTextTestCases = ["", "   ", undefined];
