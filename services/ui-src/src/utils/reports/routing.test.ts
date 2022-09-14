import { findRoutes } from "./routing";

const mockFallbackRoute = "/fallback-route";
const mockRouteArray = [
  {
    path: "/base/fake-path-1",
  },
  {
    path: "/base/fake-path-2",
  },
  {
    path: "/base/fake-path-3",
  },
];

jest.mock("react-router-dom", () => ({
  useLocation: jest
    .fn()
    .mockReturnValueOnce({ pathname: "/base/fake-path-1" })
    .mockReturnValueOnce({ pathname: "/base/fake-path-2" })
    .mockReturnValueOnce({ pathname: "/base/fake-path-3" }),
}));

describe("Test findRoutes behavior at first route in array (with no previous routes)", () => {
  it("Returns fallback as previousRoute when there are no preceding routes", () => {
    const { previousRoute } = findRoutes("/base/fake-path-1", mockRouteArray, mockFallbackRoute);
    expect(previousRoute).toEqual(mockFallbackRoute);
  });
});

describe("Test findRoutes behavior at middle route in array (with both previous and next routes)", () => {
  it("Returns previous path when there are preceding routes and next path when there are subsequent routes", () => {
    const { previousRoute, nextRoute } = findRoutes(
      "/base/fake-path-2",
      mockRouteArray,
      mockFallbackRoute
    );
    expect(previousRoute).toEqual("/base/fake-path-1");
    expect(nextRoute).toEqual("/base/fake-path-3");
  });
});

describe("Test findRoutes behavior at last route in array (with no subsequent routes)", () => {
  it("Returns fallback if there are no subsequent routes", () => {
    const { nextRoute } = findRoutes("/base/fake-path-3", mockRouteArray, mockFallbackRoute);
    expect(nextRoute).toEqual(mockFallbackRoute);
  });
});
