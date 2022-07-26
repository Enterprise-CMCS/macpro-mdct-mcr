import { getReport, writeReport } from "./report";
// utils
import { mockReportData } from "utils/testing/setupJest";

describe("Test banner methods", () => {
  test("getReport", () => {
    expect(getReport("ZA3141")).toBeTruthy();
  });

  test("postBanner", () => {
    expect(writeReport(mockReportData)).toBeTruthy();
  });
});
