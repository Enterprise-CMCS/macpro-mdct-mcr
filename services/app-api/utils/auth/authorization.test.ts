import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { mockClient } from "aws-sdk-client-mock";
import { proxyEvent } from "../testing/proxyEvent";
import { hasPermissions, isAuthorized } from "./authorization";
import { UserRoles } from "../types";

const mockVerifier = jest.fn();

jest.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
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
    jest.clearAllMocks();
  });
  test("is not authorized when no api key is passed", async () => {
    mockVerifier.mockReturnValue(true);
    const authStatus = await isAuthorized(noApiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is not authorized when token is invalid", async () => {
    mockVerifier.mockImplementation(() => {
      throw new Error("could not verify");
    });
    const authStatus = await isAuthorized(apiKeyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is authorized when api key is passed and environment variables are set", async () => {
    mockVerifier.mockReturnValue(true);
    const authStatus = await isAuthorized(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });
});

describe("Test authorization with api key and ssm parameters", () => {
  beforeEach(() => {
    mockVerifier.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("throws error when api key is passed and ssm parameters do not exist", async () => {
    const mockGetSsmParameter = jest.fn().mockImplementation(() => {
      throw new Error("failed in test");
    });
    ssmClientMock.on(GetParameterCommand).callsFake(mockGetSsmParameter);
    await expect(isAuthorized(apiKeyEvent)).rejects.toThrow("failed in test");
  });
  test("is authorized when api key is passed and ssm parameters exist", async () => {
    const mockGetSsmParameter = jest
      .fn()
      .mockResolvedValue({ Parameter: { Value: "VALUE" } });
    ssmClientMock.on(GetParameterCommand).callsFake(mockGetSsmParameter);
    const authStatus = await isAuthorized(apiKeyEvent);
    expect(authStatus).toBeTruthy();
  });

  test("authorization should reach out to SSM when missing cognito info", async () => {
    delete process.env["COGNITO_USER_POOL_ID"];
    delete process.env["COGNITO_USER_POOL_CLIENT_ID"];
    const mockGetSsmParameter = jest.fn().mockResolvedValue(mockSsmResponse);
    ssmClientMock.on(GetParameterCommand).callsFake(mockGetSsmParameter);

    await isAuthorized(apiKeyEvent);
    expect(mockGetSsmParameter).toHaveBeenCalled();
  });

  test("authorization should throw error if no values exist in SSM or env", async () => {
    delete process.env["COGNITO_USER_POOL_ID"];
    delete process.env["COGNITO_USER_POOL_CLIENT_ID"];
    ssmClientMock.on(GetParameterCommand).resolves({});

    await expect(isAuthorized(apiKeyEvent)).rejects.toThrow(Error);
  });
});

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
