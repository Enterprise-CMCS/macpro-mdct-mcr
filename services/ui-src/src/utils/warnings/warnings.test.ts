import { validateFieldWarning } from "./warnings";

describe("validateFieldWarning", () => {
  describe("returns null for fields not in fieldWarningMap", () => {
    test("returns null for a field with no warning rule", () => {
      const result = validateFieldWarning("unknownFieldId", "someValue");
      expect(result).toBeNull();
    });

    test("returns null for an empty field id", () => {
      const result = validateFieldWarning("", "someValue");
      expect(result).toBeNull();
    });
  });

  describe("returns null for all values until warning rules are added", () => {
    const testValues = ["some string", 0, 100, null, undefined];

    testValues.forEach((value) => {
      test(`returns null for value: ${value}`, () => {
        const result = validateFieldWarning("anyFieldId", value);
        expect(result).toBeNull();
      });
    });
  });
});
