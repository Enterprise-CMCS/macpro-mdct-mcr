import { getBanner, writeBanner, deleteBanner } from "./banner";
import { beforeEach, describe, expect, test, vi } from "vitest";
// utils
import { bannerId } from "../../../constants";
import { mockBannerData } from "utils/testing/setupTests";

const mockDelete = vi.fn();
const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
}));

describe("utils/requestMethods/banner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
