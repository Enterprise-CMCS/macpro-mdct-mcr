import { maskResponseData, parseFormFieldInfo } from "./export";

describe("Test parseFormFieldInfo", () => {
  test("Correctly parses field info when full props are provided", () => {
    const input = { label: "A.1 Label", hint: "Hint" };
    const result = parseFormFieldInfo(input);
    expect(result.number).toEqual("A.1");
    expect(result.label).toEqual("Label");
    expect(result.hint).toEqual("Hint");
  });

  test("Correctly parses field info when empty props are provided", () => {
    const result = parseFormFieldInfo({});
    expect(result.number).toEqual(undefined);
    expect(result.label).toEqual(undefined);
    expect(result.hint).toEqual(undefined);
  });
});

describe("Test maskResponseData", () => {
  test("Percentage mask works correctly", () => {
    const result = maskResponseData("percentage", "12");
    expect(result).toEqual("12%");
  });

  test("Currency mask works correctly", () => {
    const result = maskResponseData("currency", "12");
    expect(result).toEqual("$12");
  });

  test("Standard field is not masked", () => {
    const result = maskResponseData("mock", "12");
    expect(result).toEqual("12");
  });
});
