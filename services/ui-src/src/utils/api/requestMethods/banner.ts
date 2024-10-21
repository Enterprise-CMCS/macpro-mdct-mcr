import { AdminBannerData } from "types/banners";
import { deleteApi, getApi, postApi, updateTimeout } from "utils";

async function getBanner(bannerKey: string) {
  const path = `/banners/${bannerKey}`;
  updateTimeout();
  return getApi<AdminBannerData>(path);
}

async function writeBanner(bannerData: AdminBannerData) {
  const options = {
    body: bannerData,
  };
  const path = `/banners/${bannerData.key}`;
  updateTimeout();
  return postApi<AdminBannerData>(path, options);
}

async function deleteBanner(bannerKey: string) {
  const path = `/banners/${bannerKey}`;
  updateTimeout();
  return deleteApi(path);
}

export { getBanner, writeBanner, deleteBanner };
