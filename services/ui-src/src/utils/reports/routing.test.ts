import { useFindRoute } from "./routing";
import { mockReportJson } from "utils/testing/setupJest";

const mockFallbackRoute = mockReportJson.basePath;
const mockFlatRoutesArray = mockReportJson.flatRoutes;

jest.mock("react-router-dom", () => ({
  useLocation: jest
    .fn()
    .mockReturnValueOnce({ pathname: "/mock/mock-route-1" }) // first path
    .mockReturnValueOnce({ pathname: "/mock/mock-route-2a" }) // middle path
    .mockReturnValueOnce({ pathname: "/mock/mock-route-3" }), // last path
}));

describe("Test useFindRoute behavior at first route in array (with no previous routes)", () => {
  it("Returns fallback as previousRoute when there are no preceding routes", () => {
    const { previousRoute } = useFindRoute(
      mockFlatRoutesArray,
      mockFallbackRoute
    );
    expect(previousRoute).toEqual(mockFallbackRoute);
  });
});

describe("Test useFindRoute behavior at middle route in array (with both previous and next routes)", () => {
  it("Returns previous path when there are preceding routes and next path when there are subsequent routes", () => {
    const { previousRoute, nextRoute } = useFindRoute(
      mockFlatRoutesArray,
      mockFallbackRoute
    );
    expect(previousRoute).toEqual("/mock/mock-route-1");
    expect(nextRoute).toEqual("/mock/mock-route-2b");
  });
});

describe("Test useFindRoute behavior at last route in array (with no subsequent routes)", () => {
  it("Returns fallback if there are no subsequent routes", () => {
    const { nextRoute } = useFindRoute(mockFlatRoutesArray, mockFallbackRoute);
    expect(nextRoute).toEqual(mockFallbackRoute);
  });
});
