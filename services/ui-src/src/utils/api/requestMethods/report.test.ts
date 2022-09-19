import {
  getReport,
  getReportsByState,
  writeReport,
  deleteReport,
} from "./report";
// utils
import { mockReportDetails, mockReport } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReport", () => {
    expect(getReport(mockReportDetails)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("AB")).toBeTruthy();
  });

  test("writeReport", () => {
    expect(writeReport(mockReportDetails, mockReport)).toBeTruthy();
  });

  test("deleteReport", () => {
    expect(deleteReport(mockReportDetails)).toBeTruthy();
  });
});
