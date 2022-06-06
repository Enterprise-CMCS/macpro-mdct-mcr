import { getBanner, writeBanner, deleteBanner } from "./banner";

const testBannerKey = "testKey";

const testBannerData = {
  key: testBannerKey,
  title: "Yes here I am, a banner",
  description: "I have a description too thank you very much",
  startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
  endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
};

describe("Test banner methods", () => {
  test("getBanner", () => {
    expect(getBanner(testBannerKey)).toBeTruthy();
  });

  test("postBanner", () => {
    expect(writeBanner(testBannerData)).toBeTruthy();
  });

  test("delBanner", () => {
    expect(deleteBanner(testBannerKey)).toBeTruthy();
  });
});
