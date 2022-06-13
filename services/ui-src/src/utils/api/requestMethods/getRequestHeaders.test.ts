import { getRequestHeaders } from "./getRequestHeaders";

describe("Test getRequestHeaders error handling", () => {
  it("Logs error to console if Auth throws error", async () => {
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    const spy = jest.spyOn(console, "log");

    const mockAmplify = require("aws-amplify");
    mockAmplify.Auth.currentSession = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await getRequestHeaders();

    await expect(spy).toHaveBeenCalled();
  });
});
