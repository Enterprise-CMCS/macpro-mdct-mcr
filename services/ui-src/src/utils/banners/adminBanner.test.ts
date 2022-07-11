import { checkBannerActivityStatus } from "./adminBanner";

const currentTime = Date.now(); // 'current' time in ms since unix epoch
const oneDay = 1000 * 60 * 60 * 24; // 1000ms * 60s * 60m * 24h = 86,400,000ms
const twoDays = oneDay * 2;

describe("Test adminBanner checkBannerActivityStatus method", () => {
  it("returns false if startDate is in the future", () => {
    const startDate = (currentTime + oneDay).toString();
    const endDate = (currentTime + twoDays).toString();
    const bannerStatus = checkBannerActivityStatus(startDate, endDate);
    expect(bannerStatus).toBeFalsy();
  });

  it("returns false if endDate is in the past", () => {
    const startDate = (currentTime - twoDays).toString();
    const endDate = (currentTime - oneDay).toString();
    const bannerStatus = checkBannerActivityStatus(startDate, endDate);
    expect(bannerStatus).toBeFalsy();
  });

  it("returns true if startDate is in the past and endDate is in the future", () => {
    const startDate = (currentTime - oneDay).toString();
    const endDate = (currentTime + oneDay).toString();
    const bannerStatus = checkBannerActivityStatus(startDate, endDate);
    expect(bannerStatus).toBeTruthy();
  });
});
