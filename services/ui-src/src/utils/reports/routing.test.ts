import { useFindRoute } from "./routing";
import { mockReportJson } from "utils/testing/setupJest";

const mockFallbackRoute = "";
const mockFlatRoutesArray = mockReportJson.flatRoutes;

const baseUrl = "/report/mock/PA/myId/";
jest.mock("react-router", () => ({
  useLocation: jest
    .fn()
    .mockReturnValueOnce({ pathname: baseUrl + "mock-route-1" }) // first path
    .mockReturnValueOnce({ pathname: baseUrl + "mock-route-2a" }) // middle path
    .mockReturnValueOnce({ pathname: baseUrl + "mock-route-3" }), // last path
}));

describe("Test useFindRoute ", () => {
  it("returns fallback as previousRoute when there are no preceding routes", () => {
    const { previousRoute } = useFindRoute(
      mockFlatRoutesArray,
      mockFallbackRoute
    );
    expect(previousRoute).toEqual(mockFallbackRoute);
  });

  it("returns previous path when there are preceding routes and next path when there are subsequent routes", () => {
    const { previousRoute, nextRoute } = useFindRoute(
      mockFlatRoutesArray,
      mockFallbackRoute
    );
    expect(previousRoute).toEqual("mock-route-1");
    expect(nextRoute).toEqual("mock-route-2b");
  });
  it("Returns fallback if there are no subsequent routes", () => {
    const { nextRoute } = useFindRoute(mockFlatRoutesArray, mockFallbackRoute);
    expect(nextRoute).toEqual(mockFallbackRoute);
  });
});
