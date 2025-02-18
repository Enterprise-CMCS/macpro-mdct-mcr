import { initAuthManager, updateTimeout, getExpiration } from "utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { refreshCredentials } from "./authLifecycle";
import { sub } from "date-fns";
import { Hub } from "aws-amplify/utils";

describe("Test AuthManager Init", () => {
  test("Initializing when past expiration will require a new login", async () => {
    // Set an initial time, because tests run too fast to have different timestamps
    const expired = sub(Date.now(), { days: 5 }).toString();
    localStorage.setItem("mdctmcr_session_exp", expired);

    initAuthManager();
    const clearedTime = localStorage.getItem("mdctmcr_session_exp");
    expect(clearedTime).toEqual(null);
  });
});

describe("Test AuthManager", () => {
  beforeEach(() => {
    // Auth manager has a debounce that runs for 2s every time it updates
    vi.useFakeTimers();
    initAuthManager();
    vi.runAllTimers();
  });

  test("Test updateTimeout", () => {
    const currentTime = Date.now();
    updateTimeout();
    vi.runAllTimers(); // Dodge 2 second debounce, get the updated timestamp

    const savedTime = localStorage.getItem("mdctmcr_session_exp");
    expect(new Date(savedTime!).valueOf()).toBeGreaterThanOrEqual(
      new Date(currentTime).valueOf()
    );
  });

  test("Test getExpiration and refreshCredentials", async () => {
    // Set an initial time, because tests run too fast to have different timestamps
    const initialExpiration = sub(Date.now(), { seconds: 5 }).toString();
    localStorage.setItem("mdctmcr_session_exp", initialExpiration);
    await refreshCredentials();
    vi.runAllTimers(); // Dodge 2 second debounce, get the updated timestamp

    // Check that the new timestamp is updated
    const storedExpiration = getExpiration();
    expect(storedExpiration).not.toEqual(initialExpiration);
    expect(new Date(storedExpiration!).valueOf()).toBeGreaterThan(
      new Date(initialExpiration).valueOf()
    );
  });
  test("Test getExpiration returns an empty string if nothing is set", async () => {
    localStorage.removeItem("mdctmcr_session_exp");

    const storedExpiration = getExpiration();
    expect(storedExpiration).toEqual("");
  });
});

describe("Test AuthManager Hub Integration", () => {
  let spy = vi.spyOn(localStorage.__proto__, "setItem");

  afterEach(() => {
    spy.mockClear();
  });
  test("Listens for auth events", () => {
    Hub.listen = vi
      .fn()
      .mockImplementation((channel: string, callback: any) => {
        callback({ payload: { event: "signIn" } });
      });
    initAuthManager();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  test("Ignore unrelated auth events", () => {
    const currentTime = Date.now();
    Hub.listen = vi
      .fn()
      .mockImplementation((channel: string, callback: any) => {
        callback({ payload: { event: "nonExistantEvent" } });
      });
    initAuthManager();
    const savedTime = localStorage.getItem("mdctmcr_session_exp");
    expect(new Date(savedTime!).valueOf()).toBeGreaterThanOrEqual(
      new Date(currentTime).valueOf()
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});
