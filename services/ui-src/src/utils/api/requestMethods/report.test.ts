import { getReport, getReportsByState, postReport, putReport } from "./report";
// utils
import { mockReportKeys, mockMcparReport } from "utils/testing/setupJest";
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
    expect(getReportsByState("MCPAR", "AB")).toBeTruthy();
  });

  test("postReport", () => {
    expect(postReport("MCPAR", "AB", mockMcparReport)).toBeTruthy();
  });

  test("putReport", () => {
    expect(putReport(mockReportKeys, mockMcparReport)).toBeTruthy();
  });
});
