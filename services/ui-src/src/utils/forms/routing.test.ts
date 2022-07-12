import { makeNextRoute, makePreviousRoute } from "./routing";

const basePath = "/base";
const mockPathOrder = ["/fake-path-1", "/fake-path-2", "/fake-path-3"];

describe("Test makeNextRoute", () => {
  it("Returns next path if there are subsequent form pages", () => {
    const route = makeNextRoute(mockPathOrder, basePath, "/fake-path-2");
    expect(route).toEqual(basePath + "/fake-path-3");
  });

  it("Returns base path if there are no subsequent form pages", () => {
    const route = makeNextRoute(mockPathOrder, basePath, "/fake-path-3");
    expect(route).toEqual(basePath);
  });
});

describe("Test makePreviousRoute", () => {
  it("Returns previous path if there are preceding form pages", () => {
    const route = makePreviousRoute(mockPathOrder, basePath, "/fake-path-2");
    expect(route).toEqual(basePath + "/fake-path-1");
  });

  it("Returns base path if there are no preceding form pages", () => {
    const route = makePreviousRoute(mockPathOrder, basePath, "/fake-path-1");
    expect(route).toEqual(basePath);
  });
});
