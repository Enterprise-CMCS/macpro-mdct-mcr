import { getRequestHeaders } from "./getRequestHeaders";

const mockAmplify = require("aws-amplify/auth");

describe("Test getRequestHeaders error handling", () => {
  it("Logs error to console if Auth throws error", async () => {
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    const spy = jest.spyOn(console, "log");

    mockAmplify.fetchAuthSession = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    await getRequestHeaders();

    await expect(spy).toHaveBeenCalled();
  });

  it("Returns token if current idToken exists", async () => {
    mockAmplify.fetchAuthSession = jest.fn().mockResolvedValue({
      tokens: {
        idToken: {
          toString: () => "stringToken",
        },
      },
    });

    const result = await getRequestHeaders();

    expect(result).toStrictEqual({ "x-api-key": "stringToken" });
  });
});
