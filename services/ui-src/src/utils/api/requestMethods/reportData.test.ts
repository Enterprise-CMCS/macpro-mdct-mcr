import { getReportData, writeReportData } from "./reportData";
// utils
import { mockReportDetails, mockReportData } from "utils/testing/setupJest";

describe("Test report methods", () => {
  test("getReport", () => {
    expect(getReportData(mockReportDetails)).toBeTruthy();
  });

  test("postReport", () => {
    expect(writeReportData(mockReportDetails, mockReportData)).toBeTruthy();
  });
});
