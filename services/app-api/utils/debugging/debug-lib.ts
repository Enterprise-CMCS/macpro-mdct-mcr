import util from "util";
import { Logger } from "@smithy/types";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error";
type LogEntry = {
  date: Date;
  level: LogLevel;
  string: string;
};

const logs: LogEntry[] = [];

const buildLoggerForLevel = (level: LogLevel) => {
  return function (...content: any[]) {
    logs.push({
      date: new Date(),
      level: level,
      string: util.format.apply(null, content),
    });

    /*
     * If we have a function logging thousands of messages,
     * better to take the console performance hit mid-operation
     * than to let memory usage run away as well.
     */
    if (logs.length > 99) {
      flush();
    }
  };
};

/*
 * Individual functions are exported to support handler-lib;
 * This integrates SDK client logging with lambda logging.
 */
export const trace = buildLoggerForLevel("trace");
export const debug = buildLoggerForLevel("debug");
export const info = buildLoggerForLevel("info");
export const warn = buildLoggerForLevel("warn");
export const error = buildLoggerForLevel("error");

export function flush() {
  while (logs.length > 0) {
    const { date, level, string } = logs.shift()!;
    // eslint-disable-next-line no-console
    console[level](date, string);
  }
}

/*
 * This is only called at the beginning of a lambda handler,
 * so the log buffer should be empty anyway. But it doesn't
 * hurt to make sure!
 */
export const init = flush;

/**
 * A logger suitable for passing to any AWS client constructor.
 * Note that the `trace` log level is excluded.
 *
 * This logger accumulates log messages in an internal buffer,
 * eventually flushing them to the console.
 */
export const logger: Logger = { debug, info, warn, error };
