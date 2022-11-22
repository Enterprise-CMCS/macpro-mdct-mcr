import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";
import { AdminBannerData } from "types";
import { updateTimeout } from "utils";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.get("banners", `/banners/${bannerKey}`, request);
  return response;
}

async function writeBanner(bannerData: AdminBannerData) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: bannerData,
  };

  updateTimeout();
  const response = await API.post(
    "banners",
    `/banners/${bannerData.key}`,
    request
  );
  return response;
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  updateTimeout();
  const response = await API.del("banners", `/banners/${bannerKey}`, request);
  return response;
}

export { getBanner, writeBanner, deleteBanner };
