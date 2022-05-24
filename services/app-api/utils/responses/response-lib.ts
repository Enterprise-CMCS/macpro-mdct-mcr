export function internalServerError(body: any) {
  return buildResponse(500, body);
}

export function buildResponse(statusCode: number, body: any) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
  };
}
