import { flattenReportRoutesArray, sortReportsOldestToNewest } from "./reports";
import {
  mockFlattenedReportRoutes,
  mockReportRoutes,
  mockReport,
} from "utils/testing/setupJest";

describe("Test flattenReportRoutesArray", () => {
  it("Should flatten report routes", () => {
    const expectedResult = mockFlattenedReportRoutes;
    const result = flattenReportRoutesArray(mockReportRoutes);
    expect(result).toEqual(expectedResult);
  });
});

describe("Test sortReportsOldestToNewest", () => {
  it("Should sort reports by oldest to newest", () => {
    const unsortedReports = [
      {
        ...mockReport,
        createdAt: 1662568568589,
        programName: "created-today",
      },
      {
        ...mockReport,
        createdAt: 1662568556165,
        programName: "created-yesterday",
      },
      {
        ...mockReport,
        createdAt: 1652568576322,
        programName: "created-last-month",
      },
    ];
    const sortedReports = [
      unsortedReports[2],
      unsortedReports[1],
      unsortedReports[0],
    ];
    expect(sortReportsOldestToNewest(unsortedReports)).toEqual(sortedReports);
  });
});
