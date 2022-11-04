import { useLocation } from "react-router-dom";
import { useFindRoute } from "./routing";

jest.mock("react-router-dom");
const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;

const mockLocation = {
  pathname: "/test-path",
  state: undefined,
  key: "",
  search: "",
  hash: "",
};

const mockMcparLocation = {
  pathname: "/mcpar/program-information/point-of-contact",
  state: undefined,
  key: "",
  search: "",
  hash: "",
};

describe("Test useFindRoute behavior", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Returns fallback as previousRoute when there are no preceding routes and when there are no subsequent routes", () => {
    mockUseLocation.mockReturnValue(mockLocation);
    const { previousRoute, nextRoute } = useFindRoute();
    expect(previousRoute).toEqual("/");
    expect(nextRoute).toEqual("/");
  });
  it("Returns previous path when there are preceding routes and next path when there are subsequent routes", () => {
    mockUseLocation.mockReturnValue(mockMcparLocation);
    const { previousRoute, nextRoute } = useFindRoute();
    expect(previousRoute).toEqual("/mcpar");
    expect(nextRoute).toEqual("/mcpar/program-information/reporting-period");
  });
});
