import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "../../../constants";
import { mockBannerData } from "utils/testing/setupJest";

jest.mock("utils/auth/authLifecycle", () => ({
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
  refreshCredentials: jest.fn(),
}));

describe("Test banner methods", () => {
  test("getBanner", async () => {
    expect(await getBanner(bannerId)).toBeTruthy();
  });

  test("postBanner", async () => {
    await writeBanner(mockBannerData);
  });

  test("delBanner", async () => {
    await deleteBanner(bannerId);
  });
});
