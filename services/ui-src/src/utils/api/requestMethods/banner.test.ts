import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "../../../constants";
import { mockBannerData } from "utils/testing/setupJest";
import { initAuthManager } from "utils/auth/authLifecycle";

describe("Test banner methods", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });
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
