import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";
import { BannerShape } from "../../types/types";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  return API.get("banners", `banners/${bannerKey}`, request);
}

async function writeBanner(bannerData: BannerShape) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: bannerData,
  };
  return API.post("banners", `banners/${bannerData.key}`, request);
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  return API.del("banners", `banners/${bannerKey}`, request);
}

export { getBanner, writeBanner, deleteBanner };
