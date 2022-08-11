import { getReportStatus, writeReportStatus } from "./reportStatus";
// utils
import { mockReportDetails, mockReportStatus } from "utils/testing/setupJest";

describe("Test report status methods", () => {
  test("getReportStatus", () => {
    expect(getReportStatus(mockReportDetails)).toBeTruthy();
  });

  test("postReportStatus", () => {
    expect(writeReportStatus(mockReportDetails, mockReportStatus)).toBeTruthy();
  });
});
