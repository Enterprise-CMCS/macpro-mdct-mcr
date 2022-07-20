import { addDataToReportStructure, makeReportNavigationOrder } from "./reports";

describe("Test addDataToReportStructure", () => {
  it("addDataToReportStructure", () => {
    let route = addDataToReportStructure;
    expect(route).toEqual("addDataToReportStructure");
  });
});

describe("Test makeReportNavigationOrder", () => {
  it("makeReportNavigationOrder", () => {
    let route = makeReportNavigationOrder;
    expect(route).toEqual("makeReportNavigationOrder");
  });
});
