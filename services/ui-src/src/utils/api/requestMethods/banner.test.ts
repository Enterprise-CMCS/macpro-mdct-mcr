import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "utils/constants/constants";
import { mockBannerData } from "utils/testing/setupJest";

describe("Test banner methods", () => {
  test("getBanner", () => {
    expect(getBanner(bannerId)).toBeTruthy();
  });

  test("postBanner", () => {
    expect(writeBanner(mockBannerData)).toBeTruthy();
  });

  test("delBanner", () => {
    expect(deleteBanner(bannerId)).toBeTruthy();
  });
});
