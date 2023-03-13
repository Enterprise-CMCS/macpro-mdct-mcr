import {
  archiveReport,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  submitReport,
} from "./report";
// utils
import { mockReportKeys, mockReport } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

describe("Test report status methods", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });
  test("archiveReport", () => {
    expect(archiveReport(mockReportKeys)).toBeTruthy();
  });

  test("getReport", () => {
    expect(getReport(mockReportKeys)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("MCPAR", "AB")).toBeTruthy();
  });

  test("postReport", () => {
    expect(postReport("MCPAR", "AB", mockReport)).toBeTruthy();
  });

  test("submitReport", () => {
    expect(submitReport(mockReportKeys)).toBeTruthy();
  });

  test("putReport", () => {
    expect(putReport(mockReportKeys, mockReport)).toBeTruthy();
  });
});
