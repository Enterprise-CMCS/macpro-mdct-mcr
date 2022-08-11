import { getReport, writeReport } from "./report";
// utils
import { mockReportDetails, mockReportData } from "utils/testing/setupJest";

describe("Test report methods", () => {
  test("getReport", () => {
    expect(getReport(mockReportDetails)).toBeTruthy();
  });

  test("postReport", () => {
    expect(writeReport(mockReportDetails, mockReportData)).toBeTruthy();
  });
});
