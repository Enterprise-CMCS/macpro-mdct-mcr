import { useState, useEffect } from "react";
// utils
import { AdminBannerData } from "utils/types/types";
import { bannerId } from "../../utils/constants/constants";
// api
import {
  deleteBanner,
  getBanner,
  writeBanner,
} from "utils/api/requestMethods/banner";

const ADMIN_BANNER_ID = bannerId;

const checkBannerActivityStatus = (
  startDate: number,
  endDate: number
): boolean => {
  const currentTime = new Date().valueOf();
  return currentTime >= startDate && currentTime <= endDate;
};

export const AdminBanner = () => {
  const [bannerData, setBannerData] = useState<AdminBannerData>({
    key: "",
    title: "",
    description: "",
    link: "",
    startDate: 0,
    endDate: 0,
  });

  const fetchAdminBanner = async () => {
    const currentBanner = await getBanner(ADMIN_BANNER_ID);
    setBannerData(currentBanner.Item);
  };

  const deleteAdminBanner = async () => {
    await deleteBanner(ADMIN_BANNER_ID);
    await fetchAdminBanner();
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    await writeBanner(newBannerData);
    await fetchAdminBanner();
  };

  useEffect(() => {
    try {
      fetchAdminBanner();
    } catch (e: any) {
      // swallowing error here as it is triggered by Cypress/A11y. Works live.
      console.error("Error while fetching current banner.", e); // eslint-disable-line no-console
    }
  }, []);

  if (bannerData) {
    bannerData.isActive = checkBannerActivityStatus(
      bannerData?.startDate,
      bannerData?.endDate
    );
  }

  return {
    ...bannerData,
    fetchAdminBanner,
    writeAdminBanner,
    deleteAdminBanner,
  };
};
