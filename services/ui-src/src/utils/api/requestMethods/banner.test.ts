import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "../../../constants";
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getBanner()", async () => {
    await getBanner(bannerId);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postBanner()", async () => {
    await writeBanner(mockBannerData);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("deleteBanner()", async () => {
    await deleteBanner(bannerId);
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
