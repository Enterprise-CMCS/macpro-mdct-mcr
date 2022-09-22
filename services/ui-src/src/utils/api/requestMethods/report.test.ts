import { getReport, getReportsByState, postReport, putReport } from "./report";
// utils
import { mockReportKeys, mockReport } from "utils/testing/setupJest";

describe("Test report status methods", () => {
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
