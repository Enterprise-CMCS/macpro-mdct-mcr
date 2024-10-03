import {
  ok,
  created,
  badRequest,
  unauthenticated,
  forbidden,
  notFound,
  conflict,
  internalServerError,
} from "./response-lib";

describe("HTTP Response helper functions", () => {
  test("Responses should have correct status codes", () => {
    expect(ok({}).statusCode).toBe(200);
    expect(created({}).statusCode).toBe(201);
    expect(badRequest({}).statusCode).toBe(400);
    expect(unauthenticated({}).statusCode).toBe(401);
    expect(forbidden({}).statusCode).toBe(403);
    expect(notFound({}).statusCode).toBe(404);
    expect(conflict({}).statusCode).toBe(409);
    expect(internalServerError({}).statusCode).toBe(500);
  });

  test("Responses should exclude a body if not provided", () => {
    const response = badRequest();
    expect(response.body).toBeUndefined();
  });

  test("Responses should include a body if provided", () => {
    const res = badRequest("try again");
    expect(res.body).toBe('"try again"');
  });

  test("Responses should have the correct headers", () => {
    const response = ok({});
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(response.headers["Access-Control-Allow-Credentials"]).toBe(true);
  });
});
