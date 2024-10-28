import { AdminBannerData } from "types/banners";
import { del, get, post } from "utils";

async function getBanner(bannerKey: string) {
  const path = `/banners/${bannerKey}`;
  return get<AdminBannerData>(path);
}

async function writeBanner(bannerData: AdminBannerData) {
  const options = {
    body: bannerData,
  };
  const path = `/banners/${bannerData.key}`;
  return post<AdminBannerData>(path, options);
}

async function deleteBanner(bannerKey: string) {
  const path = `/banners/${bannerKey}`;
  return del(path);
}

export { getBanner, writeBanner, deleteBanner };
