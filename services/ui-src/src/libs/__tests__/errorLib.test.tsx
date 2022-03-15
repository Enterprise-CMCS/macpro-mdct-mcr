import { onError } from "libs/errorLib";

describe("Test errorlib.ts", () => {
  test("Expect error to alert user", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    const newError = new Error();
    newError.message = "Error Test";
    onError(newError);
    expect(window.alert).toHaveBeenCalled();
  });
});
