import { AdminBannerData } from "types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface McrState {
  bannerData: AdminBannerData | undefined;
  setBannerData: (newBannerData: AdminBannerData) => void;
  clearBannerData: () => void;
}

export const useStore = create(
  devtools<McrState>(
    (set) => ({
      // initial admin banner state
      bannerData: undefined,
      // set new banner data
      setBannerData: (newBannerData: AdminBannerData) =>
        set(() => ({ bannerData: newBannerData })),
      // clear existing banner data
      clearBannerData: () => set(() => ({ bannerData: undefined })),
    }),
    {
      enabled: true,
    }
  )
);
