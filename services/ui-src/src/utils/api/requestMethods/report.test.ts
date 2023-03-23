import {
  archiveReport,
  getReport,
  getReportsByState,
  postReport,
  putReport,
  releaseReport,
  submitReport,
} from "./report";
// utils
import { mockReportKeys, mockMcparReport } from "utils/testing/setupJest";
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
    expect(postReport("MCPAR", "AB", mockMcparReport)).toBeTruthy();
  });

  test("putReport", () => {
    expect(putReport(mockReportKeys, mockMcparReport)).toBeTruthy();
  });
  test("releaseReport", () => {
    expect(releaseReport(mockReportKeys)).toBeTruthy();
  });

  test("submitReport", () => {
    expect(submitReport(mockReportKeys)).toBeTruthy();
  });
});
