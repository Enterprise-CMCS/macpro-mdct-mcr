import { testEvent } from "../../test-util/testEvents";
import debug, { clearLogs, flush, init } from "../debug-lib";

jest.mock("aws-sdk", () => ({
  __esModule: true,
  default: {
    config: {
      logger: { log: undefined },
    },
  },
}));

//mock and suppress console calls
const mockedConsoleError = jest.fn();
const mockedConsoleDebug = jest.fn();
(global as any).console = {
  error: mockedConsoleError,
  debug: mockedConsoleDebug,
};

describe("Debug Library Functions", () => {
  afterEach(() => {
    clearLogs();
  });

  describe("Init Function", () => {
    test("logs should have a length of one", () => {
      const logs = init({ ...testEvent }, null);

      expect(logs.length).toBe(1);
      expect(logs[0].string.length).toBeGreaterThan(0);
    });

    test("logs should be overridden on init", () => {
      const event = { ...testEvent };

      debug(event);
      debug(event);
      debug(event);
      const log1 = debug(event);

      const log2 = init(event, null);

      expect(log1.length).toBe(4);
      expect(log2.length).toBe(1);
    });
  });

  describe("Flush function", () => {
    test("flush should only call error by default", () => {
      const error = new Error("test error");
      flush(error);

      expect(mockedConsoleError).toBeCalled();
      expect(mockedConsoleDebug).not.toBeCalled();
      expect(mockedConsoleError).toBeCalledWith(error);
    });

    test("flush should call debug for every log and error once", () => {
      const event = { ...testEvent };
      const error = new Error("test error");

      debug(event);
      debug(event);
      debug(event);
      debug(event);
      flush(error);

      expect(mockedConsoleError).toBeCalled();
      expect(mockedConsoleError).toBeCalledWith(error);

      expect(mockedConsoleDebug).toBeCalledTimes(4);
    });
  });

  describe("Debug Function", () => {
    test("logs should have a new object", () => {
      const logs = debug({ body: "test" });

      expect(logs.length).toBe(1);
    });

    test("logs should have event structured object", () => {
      const event = { ...testEvent };
      debug(event);
      debug(event);
      debug(event);
      const logs = debug(event);

      expect(logs.length).toBe(4);
      expect(logs[0].string.length).toBeGreaterThan(0);
    });
  });

  describe("clearLogs Function", () => {
    test("logs should be empty", () => {
      debug("test");
      debug("test");
      debug("test");
      debug("test");
      const logs = clearLogs();

      expect(logs.length).toBe(0);
    });

    test("only logs after clear should be seen", () => {
      debug("test");
      clearLogs();

      debug("test");
      const logs = debug("test");
      expect(logs.length).toBe(2);
    });
  });
});
