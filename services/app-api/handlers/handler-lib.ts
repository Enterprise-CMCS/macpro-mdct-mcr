// utils
import * as logger from "../utils/debugging/debug-lib";
import { isAuthenticated } from "../utils/auth/authorization";
import {
  HttpResponse,
  internalServerError,
  unauthenticated,
} from "../utils/responses/response-lib";
import { error } from "../utils/constants/constants";
import { sanitizeObject } from "../utils/sanitize/sanitize";
// types
import { APIGatewayProxyEvent } from "../utils/types";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<HttpResponse>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    logger.init();
    logger.debug("API event: %O", {
      body: event.body,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
    });

    if (await isAuthenticated(event)) {
      try {
        if (event.body) {
          const newEventBody = sanitizeObject(JSON.parse(event.body));
          event.body = JSON.stringify(newEventBody);
        }
        return await lambda(event, context);
      } catch (error: any) {
        logger.error("Error: %O", error);

        const body = { error: error.message };
        return internalServerError(body);
      } finally {
        logger.flush();
      }
    } else {
      return unauthenticated(error.UNAUTHORIZED);
    }
  };
}
