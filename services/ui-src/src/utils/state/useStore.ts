import { AdminBannerData, AnyObject } from "types";
import { create } from "zustand";

interface McrState {
  bannerData: AdminBannerData | undefined;
  setBannerData: Function;
}

export const useStore = create<McrState>((set) => ({
  bannerData: undefined,
  setBannerData: () =>
    set((state: AnyObject) => ({ bannerData: state.newBannerData })),
}));
