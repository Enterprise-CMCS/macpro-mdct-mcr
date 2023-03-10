import { mockReport } from "utils/testing/setupJest";
import { getRouteStatus } from "./getRouteStatus";

describe("getRouteStatusFunctionality", () => {
  test("Should return a valid status map for every route in the form other than review and submit", () => {
    const report = mockReport;
    const statusMap = getRouteStatus(report);
    expect(statusMap).toEqual([
      {
        name: "mock-route-1",
        path: "/mock/mock-route-1",
        status: true,
      },
      {
        name: "mock-route-2",
        path: "/mock/mock-route-2",
        children: [
          {
            name: "mock-route-2a",
            path: "/mock/mock-route-2a",
            status: false,
          },
          {
            name: "mock-route-2b",
            path: "/mock/mock-route-2b",
            status: true,
          },
        ],
      },
    ]);
  });
  test("Should return an empty array if there is no completionStatus from the API", () => {
    const { completionStatus, ...mockReportWithNoCompletionStatus } =
      mockReport;
    const statusMap = getRouteStatus(mockReportWithNoCompletionStatus);
    expect(completionStatus).toEqual(mockReport.completionStatus);
    expect(statusMap).toEqual([]);
  });
});
