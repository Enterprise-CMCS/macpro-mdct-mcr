import { getReport, getReportsByState, writeReport } from "./report";
// utils
import { mockReportDetails, mockReportStatus } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReport", () => {
    expect(getReport(mockReportDetails)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("AB")).toBeTruthy();
  });

  test("postReportStatus", () => {
    expect(writeReport(mockReportDetails, mockReportStatus)).toBeTruthy();
  });
});
