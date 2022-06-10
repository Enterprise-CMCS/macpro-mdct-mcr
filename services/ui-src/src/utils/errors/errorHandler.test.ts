import { errorHandler } from "./errorHandler";

const mockCallback = jest.fn(() => {});
const errorMessage = "Test error message";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(jest.fn());
});

describe("Test errorHandler", () => {
  test("Error is logged to the console", () => {
    const spy = jest.spyOn(console, "error");
    const error = new Error(errorMessage);
    errorHandler(error, mockCallback);
    expect(spy).toHaveBeenCalledWith("Error", errorMessage);
  });

  test("If callback is passed, it is called with correct data", () => {
    const error = new Error(errorMessage);
    errorHandler(error, mockCallback);
    expect(mockCallback).toHaveBeenCalledWith({
      name: "Error",
      message: errorMessage,
    });
  });

  test("If override message is passed, it is used", () => {
    const error = new Error(errorMessage);
    errorHandler(error, mockCallback, "override message");
    expect(mockCallback).toHaveBeenCalledWith({
      name: "Error",
      message: "override message",
    });
  });
});
