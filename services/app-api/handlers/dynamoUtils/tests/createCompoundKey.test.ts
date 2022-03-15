import { createCompoundKey } from "../createCompoundKey";
import { testEvent } from "../../../test-util/testEvents";

describe("Testing CreateCompundKey", () => {
  test("If no path parameters throw an error", () => {
    try {
      createCompoundKey({ ...testEvent, pathParameters: null });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("If no year, state, or coreset throw an error", () => {
    try {
      createCompoundKey({ ...testEvent, pathParameters: {} });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("Successful key creation without passed measure", () => {
    const key = createCompoundKey({
      ...testEvent,
      pathParameters: { year: "2022", state: "FL", coreSet: "ACS" },
    });
    expect(key).toEqual("FL2022ACS");
  });

  test("Successful key creation with passed measure", () => {
    const key = createCompoundKey({
      ...testEvent,
      pathParameters: {
        year: "2022",
        state: "FL",
        coreSet: "ACS",
        measure: "FUA-AD",
      },
    });
    expect(key).toEqual("FL2022ACSFUA-AD");
  });
});
