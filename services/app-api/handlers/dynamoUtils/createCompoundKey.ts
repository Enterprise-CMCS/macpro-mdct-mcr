import { APIGatewayProxyEvent } from "aws-lambda";

export const createCompoundKey = (event: APIGatewayProxyEvent) => {
  // eslint-disable-next-line no-console
  console.log(event.pathParameters.state);
  const key = "im-not-a-unique-key-yet";
  return key;
};
