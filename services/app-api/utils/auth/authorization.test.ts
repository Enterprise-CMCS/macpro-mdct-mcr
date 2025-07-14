import { proxyEvent } from "../testing/proxyEvent";
import { hasPermissions, isAuthorizedToFetchState } from "./authorization";
import { UserRoles } from "../types";

const noApiKeyEvent = { ...proxyEvent };
const apiKeyEvent = { ...proxyEvent, headers: { "x-api-key": "test" } };

const mockedDecode = jest.fn();

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: () => {
    return mockedDecode();
  },
}));

describe("Check user has permissions", () => {
  beforeEach(() => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.ADMIN,
    });
  });

  test("has permissions should pass when the asked for role is the given role", () => {
    expect(hasPermissions(apiKeyEvent, [UserRoles.ADMIN])).toBeTruthy();
  });
  test("has permissions should fail when the asked for role is the given role", () => {
    expect(hasPermissions(apiKeyEvent, [UserRoles.STATE_USER])).toBeFalsy();
  });
  test("has permissions should fail when the api token is missing", () => {
    expect(hasPermissions(noApiKeyEvent, [UserRoles.ADMIN])).toBeFalsy();
  });
});

describe("Check deprectated state rep role coalesces to state user", () => {
  test("has permissions should pass when state rep is passed and state user is asked for", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_REP,
    });
    expect(hasPermissions(apiKeyEvent, [UserRoles.STATE_USER])).toBeTruthy();
  });
  test("has permissions should pass state user is passed and asked for", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
    });
    expect(hasPermissions(apiKeyEvent, [UserRoles.STATE_USER])).toBeTruthy();
  });
  test("has permissions should fail when the api token is missing", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_REP,
    });
    expect(hasPermissions(noApiKeyEvent, [UserRoles.STATE_USER])).toBeFalsy();
  });
});

describe("Check state user permissions", () => {
  test("has permissions should pass when role and state match expected role and state", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
      "custom:cms_state": "AL",
    });
    expect(
      hasPermissions(apiKeyEvent, [UserRoles.STATE_USER], "AL")
    ).toBeTruthy();
  });
  test("has permissions should fail if state is expected but not in role", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
    });
    expect(
      hasPermissions(apiKeyEvent, [UserRoles.STATE_USER], "AL")
    ).toBeFalsy();
  });
  test("has permissions should fail if requested state does not match role", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
      "custom:cms_state": "TX",
    });
    expect(
      hasPermissions(apiKeyEvent, [UserRoles.STATE_USER], "AL")
    ).toBeFalsy();
  });
});

describe("Test isAuthorizedToFetchState", () => {
  test("isAuthorizedToFetchState should pass when requested role and state match user role and state", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
      "custom:cms_state": "AL",
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "AL")).toBeTruthy();
  });
  test("isAuthorizedToFetchState should fail if state requested does not match role", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
      "custom:cms_state": "AL",
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "TX")).toBeFalsy();
  });
  test("isAuthorizedToFetchState should fail if state is not specified in state user role", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.STATE_USER,
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "AL")).toBeFalsy();
  });
  test("isAuthorizedToFetchState should pass for admin, regardless of state", () => {
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.ADMIN,
    });
    expect(isAuthorizedToFetchState(apiKeyEvent, "TX")).toBeTruthy();
    expect(isAuthorizedToFetchState(apiKeyEvent, "AL")).toBeTruthy();
    expect(isAuthorizedToFetchState(apiKeyEvent, "OR")).toBeTruthy();
  });
});
