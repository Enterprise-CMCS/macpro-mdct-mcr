import { initAuthManager, updateTimeout, getExpiration } from "utils";
import { refreshCredentials } from "./authLifecycle";
import moment from "moment";
import { Hub } from "aws-amplify";

describe("Test AuthManager Init", () => {
  test("Initiallizing when past expiration will require a new login", async () => {
    // Set an initial time, because jest runs too fast to have different timestamps
    const expired = moment().subtract(5, "days").format().toString();
    localStorage.setItem("mdctmcr_session_exp", expired);

    initAuthManager();
    const clearedTime = localStorage.getItem("mdctmcr_session_exp");
    expect(clearedTime).toEqual(null);
  });
});

describe("Test AuthManager", () => {
  beforeEach(() => {
    // Auth manager has a debounce that runs for 2s every time it updates
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });

  test("Test updateTimeout", () => {
    const currentTime = moment();
    updateTimeout();
    jest.runAllTimers(); // Dodge 2 second debounce, get the updated timestamp

    const savedTime = localStorage.getItem("mdctmcr_session_exp");
    expect(moment(savedTime).isSameOrAfter(currentTime)).toBeTruthy();
  });

  test("Test getExpiration and refreshCredentials", async () => {
    // Set an initial time, because jest runs too fast to have different timestamps
    const initialExpiration = moment()
      .subtract(5, "seconds")
      .format()
      .toString();
    localStorage.setItem("mdctmcr_session_exp", initialExpiration);
    await refreshCredentials();
    jest.runAllTimers(); // Dodge 2 second debounce, get the updated timestamp

    // Check that the new timestamp is updated
    const storedExpiration = getExpiration();
    expect(storedExpiration).not.toEqual(initialExpiration);
    expect(moment(storedExpiration).isAfter(initialExpiration)).toBeTruthy();
  });
  test("Test getExpiration returns an empty string if nothing is set", async () => {
    localStorage.removeItem("mdctmcr_session_exp");

    const storedExpiration = getExpiration();
    expect(storedExpiration).toEqual("");
  });
});

describe("Test AuthManager Hub Integration", () => {
  let spy = jest.spyOn(localStorage.__proto__, "setItem");

  afterEach(() => {
    spy.mockClear();
  });
  test("Listens for auth events", () => {
    Hub.listen = jest
      .fn()
      .mockImplementation((channel: string, callback: any) => {
        callback({ payload: { event: "signIn" } });
      });
    initAuthManager();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test("Ignore unrelated auth events", () => {
    const currentTime = moment();
    Hub.listen = jest
      .fn()
      .mockImplementation((channel: string, callback: any) => {
        callback({ payload: { event: "nonExistantEvent" } });
      });
    initAuthManager();
    const savedTime = localStorage.getItem("mdctmcr_session_exp");
    expect(moment(savedTime).isSameOrAfter(currentTime)).toBeTruthy();
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
