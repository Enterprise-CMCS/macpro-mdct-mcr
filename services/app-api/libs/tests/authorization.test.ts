import { testEvent } from "../../test-util/testEvents";
import { isAuthorized } from "../authorization";
import { UserRoles } from "../../types";

const mockedDecode = jest.fn();

jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: () => {
    return mockedDecode();
  },
}));

describe("Authorization Lib Function", () => {
  describe("State User Tests", () => {
    const event = { ...testEvent };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue({
        "custom:cms_roles": UserRoles.STATE,
        "custom:cms_state": "AL",
      });
    });

    test("authorizaiton should fail from missing jwt key", () => {
      event.headers = {};
      expect(isAuthorized(event)).toBeFalsy();
    });

    test("authorization should pass", () => {
      expect(isAuthorized(event)).toBeTruthy();
    });

    test("authorization should fail from mismatched states", () => {
      event.pathParameters = { state: "FL" };
      expect(isAuthorized(event)).toBeFalsy();
    });

    test("authorization should pass for GET, but skip if check from missing requestState", () => {
      event.pathParameters = null;
      expect(isAuthorized(event)).toBeTruthy();
    });

    test("authorization should fail from missing requestState and non-GET call", () => {
      event.pathParameters = null;
      event.httpMethod = "POST";
      expect(isAuthorized(event)).toBeFalsy();
    });
  });

  describe("Non-State User Tests", () => {
    const event = { ...testEvent };

    beforeEach(() => {
      event.httpMethod = "GET";
      event.headers = { "x-api-key": "test" };
      event.pathParameters = { state: "AL" };
      mockedDecode.mockReturnValue({
        "custom:cms_roles": UserRoles.ADMIN,
        "custom:cms_state": "AL",
      });
    });

    test("authorization should pass", () => {
      expect(isAuthorized(event)).toBeTruthy();
    });

    test("authorization should fail from unauthorized http method", () => {
      event.httpMethod = "POST";
      expect(isAuthorized(event)).toBeFalsy();
    });
  });
});
