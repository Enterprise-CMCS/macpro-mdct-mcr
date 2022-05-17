import { APIGatewayProxyEvent } from "aws-lambda";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createKey = (event: APIGatewayProxyEvent) =>
  "im-not-a-unique-key-yet";
