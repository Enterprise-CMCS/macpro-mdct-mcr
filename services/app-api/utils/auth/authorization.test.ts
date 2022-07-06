import { proxyEvent } from "../testing/proxyEvent";
import { hasPermissions, isAuthorized } from "./authorization";
import { UserRoles } from "../types/types";

jest.mock("aws-jwt-verify", () => ({
  __esModule: true,
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
      verify: jest.fn().mockImplementation(() => {
        return true;
      }),
    })),
  },
}));

describe("Test authorization with api key", () => {
  beforeEach(() => {
    process.env["COGNITO_USER_POOL_ID"] = "fakeId";
    process.env["COGNITO_USER_POOL_CLIENT_ID"] = "fakeClientId";
  });
  test("is not authorized when no api key is passed", async () => {
    const authStatus = await isAuthorized(proxyEvent);
    expect(authStatus).toBeFalsy();
  });
  test("is authorized when api key is passed", async () => {
    proxyEvent.headers = { "x-api-key": "test" };
    const authStatus = await isAuthorized(proxyEvent);
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
  const event = { ...proxyEvent };
  beforeEach(() => {
    event.headers = { "x-api-key": "test" };
    mockedDecode.mockReturnValue({
      "custom:cms_roles": UserRoles.ADMIN,
    });
  });

  test("has permissions should pass when the asked for role is the given role", () => {
    expect(hasPermissions(event, [UserRoles.ADMIN])).toBeTruthy();
  });
  test("has permissions should fail when the asked for role is the given role", () => {
    expect(hasPermissions(event, [UserRoles.STATE_USER])).toBeFalsy();
  });
  test("has permissions should fail when the api token is missing", () => {
    event.headers = {};
    expect(hasPermissions(event, [UserRoles.ADMIN])).toBeFalsy();
  });
});
