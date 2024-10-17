import { getBanner, writeBanner, deleteBanner } from "./banner";
// utils
import { bannerId } from "../../../constants";
import { mockBannerData } from "utils/testing/setupJest";

const mockAmplifyApi = require("aws-amplify/api");

jest.mock("utils/auth/authLifecycle", () => ({
  updateTimeout: jest.fn(),
  initAuthManager: jest.fn(),
  refreshCredentials: jest.fn(),
}));

describe("Test banner methods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("getBanner", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "get");
    expect(await getBanner(bannerId)).toBeTruthy();
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("postBanner", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "post");
    await writeBanner(mockBannerData);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  test("delBanner", async () => {
    const apiSpy = jest.spyOn(mockAmplifyApi, "del");
    await deleteBanner(bannerId);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
});
