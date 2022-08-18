import {
  getReport,
  getReportsByState,
  writeReport,
  deleteReport,
} from "./report";
// utils
import { mockReportDetails, mockReportStatus } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReport", () => {
    expect(getReport(mockReportDetails)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("AB")).toBeTruthy();
  });

  test("writeReport", () => {
    expect(writeReport(mockReportDetails, mockReportStatus)).toBeTruthy();
  });

  test("deleteReport", () => {
    expect(deleteReport(mockReportDetails)).toBeTruthy();
  });
});
