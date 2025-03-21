import { genericErrorContent } from "verbiage/errors";

export const mockBannerData = {
  key: "mock-banner-key",
  title: "Yes here I am, a banner",
  description: "I have a description too thank you very much",
  startDate: 1640995200000, // 1/1/2022 00:00:00 UTC
  endDate: 1672531199000, // 12/31/2022 23:59:59 UTC
};

export const mockErrorMessage = {
  title: "We've run into a problem",
  description: genericErrorContent,
};
