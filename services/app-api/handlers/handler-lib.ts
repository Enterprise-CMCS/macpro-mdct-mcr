import * as debug from "../utils/debugging/debug-lib";
import { APIGatewayProxyEvent } from "aws-lambda";
import { isAuthorized } from "../utils/auth/authorization";
import {
  internalServerError,
  buildResponse,
} from "../utils/responses/response-lib";
import { UNAUTHORIZED_MESSAGE } from "../utils/constants/constants";
import { StatusCodes } from "../utils/types/types";

type LambdaFunction = (
  event: APIGatewayProxyEvent, // eslint-disable-line no-unused-vars
  context: any // eslint-disable-line no-unused-vars
) => Promise<any>;

export default function handler(lambda: LambdaFunction) {
  return async function (event: APIGatewayProxyEvent, context: any) {
    // Start debugger
    debug.init(event, context);

    console.log("in handler lib. event: ", event); // eslint-disable-line

    if (await isAuthorized(event)) {
      console.log("event is authorized. Trying to invoke lambda"); // eslint-disable-line
      try {
        // Run the Lambda
        const { status, body } = await lambda(event, context);
        console.log("lambda finished. status and body: ", status, body); // eslint-disable-line
        return buildResponse(status, body);
      } catch (e: any) {
        // Print debug messages
        debug.flush(e);

        console.log("lambda threw exception:", e.message); // eslint-disable-line

        const body = { error: e.message };
        return internalServerError(body);
      }
    } else {
      const body = { error: UNAUTHORIZED_MESSAGE };
      console.log("lambda unauthorized", body); // eslint-disable-line
      return buildResponse(StatusCodes.UNAUTHORIZED, body);
    }
  };
}
