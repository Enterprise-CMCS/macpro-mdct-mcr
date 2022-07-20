import { findRoute } from "./routing";

const mockBasePath = "/base";
const mockRouteArray = [
  {
    path: "/base/fake-path-1",
  },
  {
    path: "/base/fake-path-2",
  },
  {
    path: "/base/fake-path-",
  },
];

describe("Test findRoute for 'next' route", () => {
  it("Returns next path if there are subsequent form pages", () => {
    const route = findRoute(
      mockRouteArray,
      "/base/fake-path-2",
      "next",
      mockBasePath
    );
    expect(route).toEqual("/base/fake-path-3");
  });

  it("Returns base path if there are no subsequent form pages", () => {
    const route = findRoute(
      mockRouteArray,
      "/base/fake-path-3",
      "next",
      mockBasePath
    );
    expect(route).toEqual(mockBasePath);
  });
});

describe("Test findRoute for 'previous' route", () => {
  it("Returns previous path if there are preceding form pages", () => {
    const route = findRoute(
      mockRouteArray,
      "/base/fake-path-2",
      "previous",
      mockBasePath
    );
    expect(route).toEqual("/base/fake-path-1");
  });

  it("Returns base path if there are no preceding form pages", () => {
    const route = findRoute(
      mockRouteArray,
      "/base/fake-path-1",
      "previous",
      mockBasePath
    );
    expect(route).toEqual(mockBasePath);
  });
});
