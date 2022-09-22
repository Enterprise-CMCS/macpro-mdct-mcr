import * as debug from "../utils/debugging/debug-lib";
import { APIGatewayProxyEvent } from "aws-lambda";
import { isAuthorized } from "../utils/auth/authorization";
import {
  internalServerError,
  buildResponse,
} from "../utils/responses/response-lib";
import error from "../utils/constants/constants";
import { StatusCodes } from "../utils/types/types";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    debug.init(event, context);

    if (await isAuthorized(event)) {
      try {
        // Run the Lambda
        const { status, body } = await lambda(event, context);
        return buildResponse(status, body);
      } catch (error: any) {
        // Print debug messages
        debug.flush(error);

        const body = { error: error.message };
        return internalServerError(body);
      }
    } else {
      const body = { error: error.UNAUTHORIZED };
      return buildResponse(StatusCodes.UNAUTHORIZED, body);
    }
  };
}
