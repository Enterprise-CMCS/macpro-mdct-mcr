import { getReport, writeReport } from "./report";
// utils
import { mockReportData } from "utils/testing/setupJest";

describe("Test report methods", () => {
  test("getReport", () => {
    expect(getReport("AB2022")).toBeTruthy();
  });

  test("postBanner", () => {
    expect(writeReport(mockReportData)).toBeTruthy();
  });
});
