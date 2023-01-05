import { getReport, getReportsByState, postReport, putReport } from "./report";
// utils
import { mockReportKeys, mockReport } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

describe("Test report status methods", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });
  test("getReport", () => {
    expect(getReport(mockReportKeys)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("AB")).toBeTruthy();
  });

  test("postReport", () => {
    expect(postReport("AB", mockReport)).toBeTruthy();
  });

  test("putReport", () => {
    expect(putReport(mockReportKeys, mockReport)).toBeTruthy();
  });
});
