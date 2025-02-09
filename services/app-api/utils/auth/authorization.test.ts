import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { mockClient } from "aws-sdk-client-mock";
import { proxyEvent } from "../testing/proxyEvent";
import {
  hasPermissions,
  isAuthenticated,
  isAuthorizedToFetchState,
} from "./authorization";
import { UserRoles } from "../types";

const mockVerifier = vi.fn();

vi.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: vi.fn().mockImplementation(() => ({
      verify: mockVerifier,
    })),
  },
}));

const ssmClientMock = mockClient(SSMClient);
const mockSsmResponse = {
  Parameter: {
    Name: "NAME",
    Type: "SecureString",
    Value: "VALUE",
    Version: 1,
    LastModifiedDate: 1546551668.495,
    ARN: "arn:aws:ssm:ap-southeast-2:123:NAME",
  },
};

const noApiKeyEvent = { ...proxyEvent };
const apiKeyEvent = { ...proxyEvent, headers: { "x-api-key": "test" } };

describe("Test authorization with api key and environment variables", () => {
  beforeEach(() => {
    process.env["COGNITO_USER_POOL_ID"] = "fakeId";
    process.env["COGNITO_USER_POOL_CLIENT_ID"] = "fakeClientId";
  });
  afterEach(() => {
    delete process.env.COGNITO_USER_POOL_ID;
    delete process.env.COGNITO_USER_POOL_CLIENT_ID;
    vi.clearAllMocks();
  });
  test("is not authorized when no api key is passed", async () => {
    mockVerifier.mockImplementation(() => {
      throw new Error("no key provided");
    });
    const authStatus = await isAuthenticated(noApiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is not authorized when token is invalid", async () => {
    mockVerifier.mockImplementation(() => {
      throw new Error("could not verify");
    });
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is authorized when api key is passed and environment variables are set", async () => {
    mockVerifier.mockReturnValue(true);
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });
});

describe("Test authorization with api key and ssm parameters", () => {
  beforeEach(() => {
    mockVerifier.mockReturnValue(true);
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("throws error when api key is passed and ssm parameters do not exist", async () => {
    const mockGetSsmParameter = vi.fn().mockImplementation(() => {
      throw new Error("failed in test");
    });
    ssmClientMock.on(GetParameterCommand).callsFake(mockGetSsmParameter);
    await expect(isAuthenticated(apiKeyEvent)).rejects.toThrow(
      "failed in test"
    );
  });
  test("is authorized when api key is passed and ssm parameters exist", async () => {
    const mockGetSsmParameter = vi
      .fn()
      .mockResolvedValue({ Parameter: { Value: "VALUE" } });
    ssmClientMock.on(GetParameterCommand).callsFake(mockGetSsmParameter);
    const authStatus = await isAuthenticated(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });

  test("authorization should reach out to SSM when missing cognito info", async () => {
    delete process.env["COGNITO_USER_POOL_ID"];
    delete process.env["COGNITO_USER_POOL_CLIENT_ID"];
    const mockGetSsmParameter = vi.fn().mockResolvedValue(mockSsmResponse);
    ssmClientMock.on(GetParameterCommand).callsFake(mockGetSsmParameter);

    await isAuthenticated(apiKeyEvent);
    expect(mockGetSsmParameter).toHaveBeenCalled();
  });

  test("authorization should throw error if no values exist in SSM or env", async () => {
    delete process.env["COGNITO_USER_POOL_ID"];
    delete process.env["COGNITO_USER_POOL_CLIENT_ID"];
    ssmClientMock.on(GetParameterCommand).resolves({});

    await expect(isAuthenticated(apiKeyEvent)).rejects.toThrow(Error);
  });
});

const mockedDecode = vi.fn();

vi.mock("jwt-decode", () => ({
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
