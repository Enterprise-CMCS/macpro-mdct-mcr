import { useState, useEffect } from "react";
// utils
import { makeStartDate, makeEndDate } from "utils/time/time";
import { AdminBannerData } from "utils/types/types";
// api
import {
  deleteBanner,
  getBanner,
  writeBanner,
} from "utils/api/requestMethods/banner";

const ADMIN_BANNER_ID = process.env.REACT_APP_BANNER_ID!;
const temporaryBanner: AdminBannerData = {
  key: ADMIN_BANNER_ID,
  title: "Welcome to the new Managed Care Reporting tool!",
  description: "Each state must submit one report per program.",
  startDate: makeStartDate({ year: 2022, month: 1, day: 1 }),
  endDate: makeEndDate({ year: 2022, month: 12, day: 31 }),
};

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
    // TODO: remove temporary write before phase1 deployment
    writeBanner(temporaryBanner);
    fetchAdminBanner();
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
