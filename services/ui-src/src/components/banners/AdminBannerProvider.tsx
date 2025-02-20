import { createContext, ReactNode, useMemo, useEffect } from "react";
// types
import { AdminBannerData, AdminBannerMethods } from "types/banners";
// utils
import {
  deleteBanner,
  getBanners,
  writeBanner,
  useStore,
  checkDateRangeStatus,
} from "utils";
// verbiage
import { bannerErrors } from "verbiage/errors";

export const AdminBannerContext = createContext<AdminBannerMethods>({
  fetchAdminBanner: Function,
  fetchAllBanners: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const { userIsAdmin } = useStore().user ?? {};

  // state management
  const {
    allBanners,
    setAllBanners,
    bannerData,
    setBannerData,
    bannerActive,
    setBannerActive,
    bannerLoading,
    setBannerLoading,
    bannerErrorMessage,
    setBannerErrorMessage,
    bannerDeleting,
    setBannerDeleting,
  } = useStore();

  const fetchAllBanners = async () => {
    setBannerLoading(true);
    try {
      const allBanners = await getBanners();
      setAllBanners(allBanners);
    } catch {
      setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
    } finally {
      setBannerLoading(false);
    }
  };

  const fetchAdminBanner = async () => {
    setBannerLoading(true);
    try {
      const currentBanners = await getBanners();
      if (currentBanners.length > 1) {
        const currentTimeStamp = Date.now();
        // ensure banner should be active at current time
        currentBanners.filter(
          (banner: AdminBannerData) =>
            banner.startDate < currentTimeStamp &&
            banner.endDate > currentTimeStamp
        );
        // sort by earliest start date
        currentBanners.sort(
          (a: AdminBannerData, b: AdminBannerData) => a.startDate - b.startDate
        );
      }
      const bannerData = currentBanners[0] || {};
      setBannerData(bannerData);
      setBannerErrorMessage(undefined);
    } catch {
      setBannerLoading(false);
      setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
    }
    setBannerLoading(false);
  };

  const deleteAdminBanner = async (bannerKey: string) => {
    setBannerDeleting(true);
    try {
      await deleteBanner(bannerKey);
      await fetchAdminBanner();
    } catch {
      setBannerErrorMessage(bannerErrors.DELETE_BANNER_FAILED);
    }
    setBannerDeleting(false);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    try {
      await writeBanner(newBannerData);
    } catch {
      setBannerErrorMessage(bannerErrors.CREATE_BANNER_FAILED);
    }
    await fetchAdminBanner();
  };

  useEffect(() => {
    let bannerActivity = false;
    if (bannerData) {
      bannerActivity = checkDateRangeStatus(
        bannerData.startDate,
        bannerData.endDate
      );
    }
    setBannerActive(bannerActivity);
  }, [bannerData]);

  useEffect(() => {
    fetchAdminBanner();
    if (userIsAdmin) {
      fetchAllBanners();
    }
  }, [userIsAdmin]);

  const providerValue = useMemo(
    () => ({
      // all banners
      allBanners,
      setAllBanners,
      // banner data
      bannerData,
      setBannerData,
      // banner is showing
      bannerActive,
      setBannerActive,
      // banner is loading
      bannerLoading,
      setBannerLoading,
      // banner error state
      bannerErrorMessage,
      setBannerErrorMessage,
      // banner deleting state
      bannerDeleting,
      setBannerDeleting,
      // banner API calls
      fetchAdminBanner,
      fetchAllBanners,
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [
      allBanners,
      bannerData,
      bannerActive,
      bannerLoading,
      bannerErrorMessage,
      bannerDeleting,
    ]
  );

  return (
    <AdminBannerContext.Provider value={providerValue}>
      {children}
    </AdminBannerContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
