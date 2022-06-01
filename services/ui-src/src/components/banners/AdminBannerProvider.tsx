import { useState, createContext, ReactNode } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "utils/types/types";
import { bannerId } from "../../utils/constants/constants";
// api
import {
  deleteBanner,
  getBanner,
  writeBanner,
} from "utils/api/requestMethods/banner";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  bannerData: {
    key: "string",
    title: "string",
    description: "string",
    link: "string",
    startDate: 0,
    endDate: 0,
    isActive: true,
  },
  fetchAdminBanner: () => {},
  writeAdminBanner: () => {},
  deleteAdminBanner: () => {},
});

const emptyBannerData = {
  key: "",
  title: "",
  description: "",
  link: "",
  startDate: 0,
  endDate: 0,
};

export const AdminBannerProvider = ({ children }: Props) => {
  const [bannerData, setBannerData] =
    useState<AdminBannerData>(emptyBannerData);

  const fetchAdminBanner = async () => {
    const currentBanner = await getBanner(ADMIN_BANNER_ID);
    if (currentBanner.Item) {
      setBannerData(currentBanner.Item);
    } else {
      setBannerData(emptyBannerData);
    }
  };

  const deleteAdminBanner = async () => {
    await deleteBanner(ADMIN_BANNER_ID);
    await fetchAdminBanner();
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    await writeBanner(newBannerData);
    await fetchAdminBanner();
  };

  const adminBannerData = {
    bannerData,
    fetchAdminBanner,
    writeAdminBanner,
    deleteAdminBanner,
  };

  return (
    <AdminBannerContext.Provider value={adminBannerData}>
      {children}
    </AdminBannerContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
