/**
 * The response for a successful request.
 * Should include a body for GET, PUT, or POST.
 * Need not include a body for DELETE
 */
export const ok = (body?: Object) => new HttpResponse(StatusCodes.Ok, body);

/**
 * The response for a successful POST or PUT request,
 * which resulted in the creation of a new resource.
 */
export const created = (body: Object) =>
  new HttpResponse(StatusCodes.Created, body);

/**
 * The response for a failed request, due to client-side issues.
 * Typically indicates a missing parameter or malformed body.
 */
export const badRequest = (body?: Object) =>
  new HttpResponse(StatusCodes.BadRequest, body);

/**
 * The response for a client without any authorization.
 * Typically indicates an issue with the request's headers or token.
 *
 * Note: The usual name for HTTP 401 is "Unauthorized", but that's misleading.
 * Authentication is for identity; authorization is for permissions.
 */
export const unauthenticated = (body?: Object) =>
  new HttpResponse(StatusCodes.Unauthenticated, body);

/**
 * The response for a client without sufficient permissions.
 * This is specific to the requested operation.
 * For example, a regular user requesting an admin-only endpoint.
 */
export const forbidden = (body?: Object) =>
  new HttpResponse(StatusCodes.Forbidden, body);

/**
 * The response for a request that assumes the existence of a missing resource.
 * For example, attempting to submit a report that isn't in the database.
 */
export const notFound = (body?: Object) =>
  new HttpResponse(StatusCodes.NotFound, body);

/**
 * The response for a request that assumes the server is in a different state.
 * For example, attempting to submit a report that's already submitted.
 */
export const conflict = (body?: Object) =>
  new HttpResponse(StatusCodes.Conflict, body);

/**
 * The response for a request that errored out on the server side.
 * Typically indicates there is nothing the client can do to resolve the issue.
 */
export const internalServerError = (body?: Object) =>
  new HttpResponse(StatusCodes.InternalServerError, body);

/**
 * Note: Production code shouldn't need to reference this directly.
 * Use a helper method instead.
 *
 * This enum is listed mainly for the purpose of unit testing.
 */
export enum StatusCodes {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthenticated = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

/**
 * Note: Production code shouldn't need to reference this directly.
 * Use a helper method instead.
 */
export class HttpResponse {
  readonly statusCode: number;
  readonly body: string | undefined;
  readonly headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };
  constructor(statusCode: number, body?: Object | undefined) {
    this.statusCode = statusCode;
    if (body !== undefined) {
      this.body = JSON.stringify(body);
    }
  }
}
