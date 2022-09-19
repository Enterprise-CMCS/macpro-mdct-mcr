import {
  getReport,
  getReportsByState,
  writeReport,
  deleteReport,
} from "./report";
// utils
import { mockReportKeys, mockReport } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReport", () => {
    expect(getReport(mockReportKeys)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("AB")).toBeTruthy();
  });

  test("writeReport", () => {
    expect(writeReport(mockReportKeys, mockReport)).toBeTruthy();
  });

  test("deleteReport", () => {
    expect(deleteReport(mockReportKeys)).toBeTruthy();
  });
});
