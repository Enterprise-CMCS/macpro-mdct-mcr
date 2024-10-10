import { get, post, del } from "aws-amplify/api";
import { getRequestHeaders } from "./getRequestHeaders";
import { AdminBannerData } from "types/banners";
import { updateTimeout } from "utils";

const apiName = "mcr";

async function getBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/banners/${bannerKey}`;

  updateTimeout();
  const { body } = await get({
    apiName,
    path,
    options,
  }).response;
  return await body.json();
}

async function writeBanner(bannerData: AdminBannerData) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: bannerData,
  };
  const path = `/banners/${bannerData.key}`;

  updateTimeout();
  await post({
    apiName,
    path,
    options,
  }).response;
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/banners/${bannerKey}`;

  updateTimeout();
  await del({
    apiName,
    path,
    options,
  }).response;
}

export { getBanner, writeBanner, deleteBanner };
