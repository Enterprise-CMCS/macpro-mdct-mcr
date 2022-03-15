import * as debug from "./debug-lib";
import { APIGatewayProxyEvent } from "aws-lambda";
import { isAuthorized } from "./authorization";
import { failure, success, buildResponse } from "./response-lib";

type LambdaFunction = (
  event: APIGatewayProxyEvent,
  context: any
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
