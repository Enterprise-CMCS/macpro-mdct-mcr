import { AdminBannerData } from "types";

// initial admin banner state
export interface AdminBannerState {
  // INITIAL STATE
  bannerData: AdminBannerData | undefined;
  bannerActive: boolean;
  bannerLoading: boolean;
  bannerErrorMessage: string;
  bannerDeleting: boolean;
  // ACTIONS
  setBannerData: (newBannerData: AdminBannerData | undefined) => void;
  clearAdminBanner: () => void;
  setBannerActive: (bannerStatus: boolean) => void;
  setBannerLoading: (bannerLoading: boolean) => void;
  setBannerErrorMessage: (bannerErrorMessage: string) => void;
  setBannerDeleting: (bannerDeleting: boolean) => void;
}
