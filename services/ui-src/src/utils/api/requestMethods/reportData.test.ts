import { getReportData, writeReportData, deleteReportData } from "./reportData";
// utils
import { mockReportDetails, mockReportData } from "utils/testing/setupJest";

describe("Test report methods", () => {
  test("getReport", () => {
    expect(getReportData(mockReportDetails)).toBeTruthy();
  });

  test("writeReport", () => {
    expect(writeReportData(mockReportDetails, mockReportData)).toBeTruthy();
  });

  test("deleteReport", () => {
    expect(deleteReportData(mockReportDetails)).toBeTruthy();
  });
});
