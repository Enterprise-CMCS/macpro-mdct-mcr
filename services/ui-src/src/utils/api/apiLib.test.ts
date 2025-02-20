import {
  authenticateWithIDM,
  del,
  get,
  getRequestHeaders,
  getTokens,
  loginUser,
  logoutUser,
  post,
  put,
  refreshSession,
} from "utils";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockResponse = (method?: string) => ({
  response: { body: { json: () => ({ test: method }) } },
});
const mockDelete = vi.fn().mockImplementation(() => ({ response: {} }));
const mockGet = vi.fn().mockImplementation(() => mockResponse("get"));
const mockPost = vi.fn().mockImplementation(() => mockResponse("post"));
const mockPut = vi.fn().mockImplementation(() => mockResponse("put"));
const mockSession = vi.fn();
const mockSignInWithRedirect = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockTimeout = vi.fn();

vi.mock("aws-amplify/api", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
  put: () => mockPut(),
}));

vi.mock("aws-amplify/auth", () => ({
  fetchAuthSession: () => mockSession(),
  signIn: () => mockSignIn(),
  signOut: () => mockSignOut(),
  signInWithRedirect: () => mockSignInWithRedirect(),
}));

vi.mock("utils/auth/authLifecycle", () => ({
  updateTimeout: () => mockTimeout(),
}));

describe("utils/api/apiLib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRequestHeaders()", () => {
    test("Logs error to console if Auth throws error", async () => {
      vi.spyOn(console, "log").mockImplementation(vi.fn());
      const spy = vi.spyOn(console, "log");

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

  test("authenticateWithIDM()", async () => {
    await authenticateWithIDM();
    expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1);
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

  test("del()", async () => {
    const test = async () => await del("/del");
    await expect(test()).resolves.toBeUndefined();
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("get()", async () => {
    const test = async () => await get<string>("/get");
    await expect(test()).resolves.toEqual({ test: "get" });
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("post()", async () => {
    const test = async () => await post<string>("/post");
    await expect(test()).resolves.toEqual({ test: "post" });
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("put()", async () => {
    const test = async () => await put<string>("/put");
    await expect(test()).resolves.toEqual({ test: "put" });
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockTimeout).toHaveBeenCalledTimes(1);
  });

  test("API error throws with response info", async () => {
    vi.spyOn(console, "log").mockImplementation(vi.fn());
    const spy = vi.spyOn(console, "log");

    mockGet.mockImplementationOnce(() => {
      throw {
        response: {
          body: "Error Info",
        },
      };
    });

    await expect(get("/get")).rejects.toThrow(
      "Request Failed - /get - Error Info"
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("API error throws without response info", async () => {
    vi.spyOn(console, "log").mockImplementation(vi.fn());
    const spy = vi.spyOn(console, "log");

    mockPost.mockImplementationOnce(() => {
      throw "String Error";
    });

    await expect(post("/post")).rejects.toThrow(
      "Request Failed - /post - undefined"
    );
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
