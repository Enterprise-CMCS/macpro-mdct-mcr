import { errorHandler } from "./errorHandler";

jest.spyOn(window, "alert").mockImplementation(() => {});
const mockCallback = jest.fn(() => {});

describe("Test errorHandler", () => {
  test("Expect error to alert user", () => {
    const errorMessage = "Test error message";
    const newError = new Error(errorMessage);
    errorHandler(newError, mockCallback);
    expect(mockCallback).toHaveBeenCalled();
  });

  test("If error is well constructed, the error message is used", () => {
    const errorMessage = "Test error message";
    const wellConstructedError = new Error(errorMessage);
    expect(errorHandler(wellConstructedError, mockCallback).message).toEqual(
      errorMessage
    );
  });

  test("If error is not well constructed, it is stringified", () => {
    const poorlyConstructedError = {
      error: "idk am i an error?",
      yeah: "guess so",
    };
    expect(errorHandler(poorlyConstructedError, mockCallback).message).toEqual(
      JSON.stringify(poorlyConstructedError)
    );
  });
});
