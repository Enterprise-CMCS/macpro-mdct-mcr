import { errorHandler } from "./errorHandler";

jest.spyOn(window, "alert").mockImplementation(() => {});

describe("Test errorHandler", () => {
  test("Expect error to alert user", () => {
    const errorMessage = "Test error message";
    const newError = new Error(errorMessage);
    errorHandler(newError);
    expect(window.alert).toHaveBeenCalled();
  });

  test("If error is well constructed, the error message is used", () => {
    const errorMessage = "Test error message";
    const wellConstructedError = new Error(errorMessage);
    errorHandler(wellConstructedError);
    expect(errorHandler(wellConstructedError)).toEqual(errorMessage);
  });

  test("If error is not well constructed, it is stringified", () => {
    const poorlyConstructedError = {
      error: "idk am i an error?",
      yeah: "guess so",
    };
    errorHandler(poorlyConstructedError);
    expect(errorHandler(poorlyConstructedError)).toEqual(
      JSON.stringify(poorlyConstructedError)
    );
  });
});
