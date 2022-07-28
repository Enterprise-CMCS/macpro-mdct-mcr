import { getReportStatus, writeReportStatus } from "./reportStatus";
// utils
import { mockReportStatusData } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReportStatus", () => {
    expect(getReportStatus("AB2022", "testProgram")).toBeTruthy();
  });

  test("postReportStatus", () => {
    expect(writeReportStatus(mockReportStatusData)).toBeTruthy();
  });
});
