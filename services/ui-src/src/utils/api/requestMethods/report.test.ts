import {
  getReportMetadata,
  getReportsByState,
  writeReportMetadata,
  deleteReport,
} from "./report";
// utils
import { mockReportKeys, mockReport } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReportMetadata", () => {
    expect(getReportMetadata(mockReportKeys)).toBeTruthy();
  });

  test("getReportsByState", () => {
    expect(getReportsByState("AB")).toBeTruthy();
  });

  test("writeReportMetadata", () => {
    expect(writeReportMetadata(mockReportKeys, mockReport)).toBeTruthy();
  });

  test("deleteReport", () => {
    expect(deleteReport(mockReportKeys)).toBeTruthy();
  });
});
