import { proxyEvent } from "../testing/proxyEvent";
import { hasPermissions, isAuthorized } from "./authorization";
import { UserRoles } from "../types/types";

const mockVerifier = jest.fn();

jest.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
      verify: mockVerifier,
    })),
  },
}));

const mockGetParameter = jest.fn();

jest.mock("aws-sdk", () => {
  const mockSSMInstance = {
    getParameter: (_x: any) => ({ promise: mockGetParameter }),
  };
  const mockSSM = jest.fn(() => mockSSMInstance);

  return { SSM: mockSSM };
});

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
    await expect(isAuthorized(apiKeyEvent)).rejects.toThrow(
      "cannot load cognito values"
    );
  });
  test("is authorized when api key is passed and ssm parameters exist", async () => {
    mockGetParameter.mockReturnValue({ Parameter: { Value: "VALUE" } });
    const authStatus = await isAuthorized(apiKeyEvent);
    expect(authStatus).toBeTruthy();
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
