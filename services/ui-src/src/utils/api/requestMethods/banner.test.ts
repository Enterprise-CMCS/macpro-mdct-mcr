import { getBanners, writeBanner, deleteBanner } from "./banner";
// utils
import { mockBannerData } from "utils/testing/setupJest";

const mockDelete = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
}));

describe("utils/requestMethods/banner", () => {
  const mockBannerKey = mockBannerData.key;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getBanners()", async () => {
    await getBanners();
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postBanner()", async () => {
    await writeBanner(mockBannerData);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("deleteBanner()", async () => {
    await deleteBanner(mockBannerKey);
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
