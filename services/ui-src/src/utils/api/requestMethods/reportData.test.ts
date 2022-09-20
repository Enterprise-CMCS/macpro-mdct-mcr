import { getReportData, writeReportData } from "./reportData";
// utils
import { mockReportKeys, mockReportData } from "utils/testing/setupJest";

describe("Test reportData methods", () => {
  test("getReportData", () => {
    expect(getReportData(mockReportKeys)).toBeTruthy();
  });

  test("writeReportData", () => {
    expect(writeReportData(mockReportKeys, mockReportData)).toBeTruthy();
  });
});
