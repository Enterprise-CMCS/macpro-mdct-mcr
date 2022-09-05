import { useFindRoute } from "./routing";

const mockBasePath = "/base";
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

jest.mock("react-router", () => ({
  useLocation: jest
    .fn()
    .mockReturnValueOnce({ pathname: "/base/fake-path-1" })
    .mockReturnValueOnce({ pathname: "/base/fake-path-2" })
    .mockReturnValueOnce({ pathname: "/base/fake-path-3" }),
}));

describe("Test useFindRoute behavior at first route in array (with no previous routes)", () => {
  it("Returns base path as previousRoute when there are no preceding routes", () => {
    const { previousRoute } = useFindRoute(mockRouteArray, mockBasePath);
    expect(previousRoute).toEqual(mockBasePath);
  });
});

describe("Test useFindRoute behavior at middle route in array (with both previous and next routes)", () => {
  it("Returns previous path when there are preceding routes and next path when there are subsequent routes", () => {
    const { previousRoute, nextRoute } = useFindRoute(
      mockRouteArray,
      mockBasePath
    );
    expect(previousRoute).toEqual("/base/fake-path-1");
    expect(nextRoute).toEqual("/base/fake-path-3");
  });
});

describe("Test useFindRoute behavior at last route in array (with no subsequent routes)", () => {
  it("Returns base path if there are no subsequent routes", () => {
    const { nextRoute } = useFindRoute(mockRouteArray, mockBasePath);
    expect(nextRoute).toEqual(mockBasePath);
  });
});
