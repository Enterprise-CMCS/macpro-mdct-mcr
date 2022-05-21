import * as debug from "../utils/debugging/debug-lib";
import { APIGatewayProxyEvent } from "aws-lambda";
import { isAuthorized } from "../utils/auth/authorization";
import {
  failure,
  success,
  buildResponse,
} from "../utils/responses/response-lib";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    debug.init(event, context);

    if (isAuthorized(event)) {
      try {
        // Run the Lambda
        const body = await lambda(event, context);
        return success(body);
      } catch (e: any) {
        // Print debug messages
        debug.flush(e);

        const body = { error: e.message };
        return failure(body);
      }
    } else {
      const body = { error: "User is not authorized to access this resource." };
      return buildResponse(403, body);
    }
  };
}
