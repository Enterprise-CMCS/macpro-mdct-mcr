import { createCompoundKey } from "../createCompoundKey";
import { testEvent } from "../../../test-util/testEvents";

describe("Testing CreateCompundKey", () => {
  test("Successful key creation without passed banner", () => {
    const key = createCompoundKey({
      ...testEvent,
    });
    // TODO: CHANGE
    expect(key).toEqual("im-not-a-unique-key-yet");
  });

  test("Successful key creation with passed banner", () => {
    const key = createCompoundKey({
      ...testEvent,
    });
    // TODO: CHANGE
    expect(key).toEqual("im-not-a-unique-key-yet");
  });
});
