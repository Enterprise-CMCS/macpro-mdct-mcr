import { errorHandler } from "./errorHandler";

describe("Test errorHandler", () => {
  test("Expect error to alert user", () => {
    jest.spyOn(window, "alert").mockImplementation(() => {});

    const newError = new Error();
    newError.message = "Error Test";
    errorHandler(newError);
    expect(window.alert).toHaveBeenCalled();
  });
});
