import { addDataToReportStructure, makeRouteArray } from "./reports";

describe("Test addDataToReportStructure", () => {
  it("addDataToReportStructure", () => {
    let route = addDataToReportStructure;
    expect(route).toEqual("addDataToReportStructure");
  });
});

describe("Test makeRouteArray", () => {
  it("makeRouteArray", () => {
    let route = makeRouteArray;
    expect(route).toEqual("makeRouteArray");
  });
});
