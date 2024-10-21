import {
  deleteApi,
  getApi,
  getRequestHeaders,
  getTokens,
  loginUser,
  logoutUser,
  postApi,
  putApi,
  refreshSession,
} from "utils";

const mockResponse = { response: { body: { json: () => jest.fn() } } };
const mockDelete = jest.fn().mockImplementation(() => mockResponse);
const mockGet = jest.fn().mockImplementation(() => mockResponse);
const mockPost = jest.fn().mockImplementation(() => mockResponse);
const mockPut = jest.fn().mockImplementation(() => mockResponse);
const mockSession = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

jest.mock("aws-amplify/api", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
  put: () => mockPut(),
}));

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: () => mockSession(),
  signIn: () => mockSignIn(),
  signOut: () => mockSignOut(),
}));

describe("request", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRequestHeaders()", () => {
    test("Logs error to console if Auth throws error", async () => {
      jest.spyOn(console, "log").mockImplementation(jest.fn());
      const spy = jest.spyOn(console, "log");

      mockSession.mockImplementation(() => {
        throw new Error();
      });

      await getRequestHeaders();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test("Returns token if current idToken exists", async () => {
      mockSession.mockResolvedValue({
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

  test("getTokens()", async () => {
    await getTokens();
    expect(mockSession).toHaveBeenCalledTimes(1);
  });

  test("loginUser()", async () => {
    await loginUser("email@address.com", "test");
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  test("logoutUser()", async () => {
    await logoutUser();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  test("refreshSession()", async () => {
    await refreshSession();
    expect(mockSession).toHaveBeenCalledTimes(1);
  });

  test("deleteApi()", async () => {
    await deleteApi("/");
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  test("getApi()", async () => {
    await getApi<string>("/");
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postApi()", async () => {
    await postApi<string>("/", { body: "" });
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("putApi()", async () => {
    await putApi<string>("/");
    expect(mockPut).toHaveBeenCalledTimes(1);
  });
});
