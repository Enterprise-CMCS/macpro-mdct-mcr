import { buildResponse, internalServerError } from "./response-lib";

test("Internal Server Error should give a 500 status", () => {
  const res = internalServerError("internal error");
  expect(res.body).toBe("internal error");
  expect(res.statusCode).toBe(500);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.headers["Access-Control-Allow-Credentials"]).toBe(true);
});

test("Build Response should create an object with a status code 420 and message", () => {
  const res = buildResponse(400, "status is 400");
  expect(res.body).toBe("status is 400");
  expect(res.statusCode).toBe(400);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.headers["Access-Control-Allow-Credentials"]).toBe(true);
});

test("Build Response should create an object with a status code 403 and message", () => {
  const res = buildResponse(403, "Unauthorized");
  expect(res.body).toBe("Unauthorized");
  expect(res.statusCode).toBe(403);
  expect(res.headers["Access-Control-Allow-Origin"]).toBe("*");
  expect(res.headers["Access-Control-Allow-Credentials"]).toBe(true);
});
