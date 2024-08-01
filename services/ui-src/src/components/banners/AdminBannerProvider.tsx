import { createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerMethods } from "types/banners";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
// api
import {
  deleteBanner,
  getBanner,
  writeBanner,
  useStore,
  checkDateRangeStatus,
} from "utils";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerMethods>({
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
});

export const AdminBannerProvider = ({ children }: Props) => {
  // state management
  const {
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

  const fetchAdminBanner = async () => {
    setBannerLoading(true);
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      const newBannerData = currentBanner?.Item || {};
      setBannerData(newBannerData);
      setBannerErrorMessage(undefined);
    } catch (_error: any) {
      setBannerLoading(false);
      setBannerErrorMessage(bannerErrors.GET_BANNER_FAILED);
    }
    setBannerLoading(false);
  };

  const deleteAdminBanner = async () => {
    setBannerDeleting(true);
    try {
      await deleteBanner(ADMIN_BANNER_ID);
      await fetchAdminBanner();
    } catch (_error: any) {
      setBannerErrorMessage(bannerErrors.DELETE_BANNER_FAILED);
    }
    setBannerDeleting(false);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    try {
      await writeBanner(newBannerData);
    } catch (_error: any) {
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
  }, []);

  const providerValue = useMemo(
    () => ({
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
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [
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
