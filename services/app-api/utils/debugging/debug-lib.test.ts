/* eslint-disable no-console */
import {
  trace,
  debug,
  info,
  warn,
  error,
  flush,
  init,
  logger,
} from "./debug-lib";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

vi.mock("./debug-lib", async (importOriginal) => ({
  ...(await importOriginal()),
}));

vi.spyOn(console, "trace").mockImplementation(vi.fn());
vi.spyOn(console, "debug").mockImplementation(vi.fn());
vi.spyOn(console, "info").mockImplementation(vi.fn());
vi.spyOn(console, "warn").mockImplementation(vi.fn());
vi.spyOn(console, "error").mockImplementation(vi.fn());

describe("Debug Library Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  test("Flush should write all logs in the buffer", () => {
    debug("test message");
    expect(console.debug).not.toHaveBeenCalled();
    flush();
    expect(console.debug).toHaveBeenCalledTimes(1);
    flush();
    expect(console.debug).toHaveBeenCalledTimes(1);
  });

  test("Init should ensure an empty buffer", () => {
    expect(init).toBe(flush);
  });

  test("Each log level should forward its messages to console", () => {
    trace("test");
    debug("test");
    info("test");
    warn("test");
    error("test");

    flush();

    expect(console.trace).toHaveBeenCalled();
    expect(console.debug).toHaveBeenCalled();
    expect(console.info).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  test("AWS-compatible logger should have necessary functions", () => {
    expect(logger.debug).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
  });

  test("Logger supports printf-style string formatting", () => {
    debug("%s %d %O", "hello", 2, { person: "you" });
    flush();

    const [date, message] = (console.debug as Mock).mock.calls[0];
    expect(date).toBeInstanceOf(Date);
    expect(message).toBe(`hello 2 { person: 'you' }`);
  });
});
