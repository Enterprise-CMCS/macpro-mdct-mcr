import util from "util";
import AWS from "aws-sdk";
// types
import { APIGatewayProxyEvent } from "../../utils/types";

let logs: { date: Date; string: string }[] = [];

// Log AWS SDK calls
AWS.config.logger = { log: debug };

export default function debug(...args: any[]) {
  logs.push({
    date: new Date(),
    string: util.format.apply(null, args),
  });
  return logs;
}

export function init(event: APIGatewayProxyEvent, _context: any) {
  logs = [];

  // Log API event
  return debug("API event", {
    body: event.body,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
  });
}

export function flush(e: Error) {
  logs.forEach(({ date, string }) => console.debug(date, string)); // eslint-disable-line no-console
  console.error(e); // eslint-disable-line no-console
}

export function clearLogs() {
  logs = [];
  return logs;
}
