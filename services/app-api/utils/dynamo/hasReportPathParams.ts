import { APIGatewayProxyEventPathParameters } from "aws-lambda";

export const hasReportPathParams = (
  eventParams: APIGatewayProxyEventPathParameters,
  requiredParams: string[]
) => {
  // check if every required parameter is passed to given event
  return requiredParams.every(
    (requiredParam: string) => eventParams[requiredParam]
  );
};
