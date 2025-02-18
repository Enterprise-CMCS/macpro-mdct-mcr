import { useFindRoute } from "./routing";
import { mockReportJson } from "utils/testing/setupTests";
import { describe, expect, it, MockedFunction, vi } from "vitest";
import { useLocation, Location } from "react-router-dom";

const mockFallbackRoute = mockReportJson.basePath;
const mockFlatRoutesArray = mockReportJson.flatRoutes;

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useLocation: vi.fn(),
}));
const mockUseLocation = useLocation as MockedFunction<typeof useLocation>;

describe("Test useFindRoute behavior at first route in array (with no previous routes)", () => {
  it("Returns fallback as previousRoute when there are no preceding routes", () => {
    mockUseLocation.mockReturnValueOnce({
      pathname: "/mock/mock-route-1",
    } as Location);
    const { previousRoute } = useFindRoute(
      mockFlatRoutesArray,
      mockFallbackRoute
    );
    expect(previousRoute).toEqual(mockFallbackRoute);
  });
});

describe("Test useFindRoute behavior at middle route in array (with both previous and next routes)", () => {
  it("Returns previous path when there are preceding routes and next path when there are subsequent routes", () => {
    mockUseLocation.mockReturnValueOnce({
      pathname: "/mock/mock-route-2a",
    } as Location);
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
    mockUseLocation.mockReturnValueOnce({
      pathname: "/mock/mock-route-3",
    } as Location);
    const { nextRoute } = useFindRoute(mockFlatRoutesArray, mockFallbackRoute);
    expect(nextRoute).toEqual(mockFallbackRoute);
  });
});
