import { getReportData, writeReportData } from "./reportData";
// utils
import { mockReportKeys, mockReportData } from "utils/testing/setupJest";

describe("Test report methods", () => {
  test("getReport", () => {
    expect(getReportData(mockReportKeys)).toBeTruthy();
  });

  test("writeReport", () => {
    expect(writeReportData(mockReportKeys, mockReportData)).toBeTruthy();
  });
});
