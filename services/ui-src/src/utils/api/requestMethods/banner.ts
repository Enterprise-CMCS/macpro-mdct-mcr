import { AdminBannerData } from "types/banners";
import { del, get, post, updateTimeout } from "utils";

async function getBanner(bannerKey: string) {
  const path = `/banners/${bannerKey}`;
  updateTimeout();
  return get<AdminBannerData>(path);
}

async function writeBanner(bannerData: AdminBannerData) {
  const options = {
    body: bannerData,
  };
  const path = `/banners/${bannerData.key}`;
  updateTimeout();
  return post<AdminBannerData>(path, options);
}

async function deleteBanner(bannerKey: string) {
  const path = `/banners/${bannerKey}`;
  updateTimeout();
  return del(path);
}

export { getBanner, writeBanner, deleteBanner };
