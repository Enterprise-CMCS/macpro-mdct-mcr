import { proxyEvent } from "../testing/proxyEvent";
import {
  hasPermissions,
  // isAuthorized
} from "./authorization";
import { UserRoles } from "../types/types";

const mockedDecode = jest.fn();

/*
 * const mockPayload = {
 *   sub: "f97b3041-dd71-454f-a62f-ab113408c4e3",
 *   email_verified: true,
 *   iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_lerDvs4wn",
 *   "cognito:username": "f97b3041-dd71-454f-a62f-ab113408c4e3",
 *   "custom:cms_roles": "mdctmcr-approver",
 *   given_name: "Adam",
 *   origin_jti: "95949660-f3b9-414e-917e-cdf1c98a192f",
 *   aud: "4n2andd7qumjgdojec3cbqsemu",
 *   event_id: "682f627c-0b21-4a76-9557-1c3ac2b9062a",
 *   token_use: "id",
 *   auth_time: 1653333666,
 *   exp: 1653337266,
 *   iat: 1653333666,
 *   family_name: "Admins",
 *   jti: "a2f6ef14-23fb-4661-9c23-166a89343171",
 *   email: "adminuser@test.com",
 * };
 */

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: () => {
    return mockedDecode();
  },
}));

/*
 * jest.mock("aws-jwt-verify", () => ({
 *   __esModule: true,
 *   CognitoJwtVerifier: {
 *     create: jest.fn().mockImplementation(() => {
 *       return true;
 *     }),
 *     verify: jest.fn().mockImplementation(() => {
 *       return false;
 *     }),
 *   },
 * }));
 */

/*
 * describe("Authorization check", () => {
 *   describe("Authorization token Tests", () => {
 *     const event = { ...proxyEvent };
 */

/*
 *     beforeEach(() => {
 *       event.headers = { "x-api-key": "test" };
 *     });
 */

/*
 *     test("authorization should fail from missing jwt key", () => {
 *       event.headers = {};
 *       expect(isAuthorized(event)).toBeFalsy();
 *     });
 */

/*
 *     test("authorization should pass", () => {
 *       expect(isAuthorized(event)).toBeTruthy();
 *     });
 *   });
 * });
 */

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
    expect(hasPermissions(event, [UserRoles.STATE])).toBeFalsy();
  });
  test("has permissions should fail when the api token is missing", () => {
    event.headers = {};
    expect(hasPermissions(event, [UserRoles.ADMIN])).toBeFalsy();
  });
});
