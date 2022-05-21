import { API } from "aws-amplify";
import { getRequestHeaders } from "./getRequestHeaders";
import { BannerShape } from "../../types/types";
// utils
import { checkBannerActiveDates } from "../../banner/banner";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };

  const response = await API.get("banners", `banners/${bannerKey}`, request);
  if (response.Item) {
    try {
      response.Item.isActive = checkBannerActiveDates(
        response.Item?.startDate,
        response.Item?.endDate
      );
    } catch (error) {
      console.log("Error parsing banner active state.", error); // eslint-disable-line no-console
    }
  }
  // console.log("done: getBanner", response);
  return response;
}

async function writeBanner(bannerData: BannerShape) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
    body: bannerData,
  };
  const response = await API.post(
    "banners",
    `banners/${bannerData.key}`,
    request
  );
  // console.log("done: writeBanner", response.Item);
  return response;
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const request = {
    headers: { ...requestHeaders },
  };
  const response = await API.del("banners", `banners/${bannerKey}`, request);
  // console.log("done: deleteBanner", response);
  return response;
}

export { getBanner, writeBanner, deleteBanner };
