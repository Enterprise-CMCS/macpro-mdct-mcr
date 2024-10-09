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
  const restOperation = get({
    apiName,
    path,
    options,
  });
  const { body } = await restOperation.response;
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
  const restOperation = post({
    apiName,
    path,
    options,
  });
  await restOperation.response;
}

async function deleteBanner(bannerKey: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };
  const path = `/banners/${bannerKey}`;

  updateTimeout();
  const restOperation = del({
    apiName,
    path,
    options,
  });
  await restOperation.response;
}

export { getBanner, writeBanner, deleteBanner };
