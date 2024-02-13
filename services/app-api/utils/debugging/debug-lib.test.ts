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

jest.mock("./debug-lib", () => ({
  ...jest.requireActual("./debug-lib"),
}));

jest.spyOn(console, "trace").mockImplementation();
jest.spyOn(console, "debug").mockImplementation();
jest.spyOn(console, "info").mockImplementation();
jest.spyOn(console, "warn").mockImplementation();
jest.spyOn(console, "error").mockImplementation();

describe("Debug Library Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
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

    const [date, message] = (console.debug as jest.Mock).mock.calls[0];
    expect(date).toBeInstanceOf(Date);
    expect(message).toBe(`hello 2 { person: 'you' }`);
  });
});
