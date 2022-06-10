import { useState, createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "utils/types/types";
import { bannerId } from "../../utils/constants/constants";
// api
import { deleteBanner, getBanner, writeBanner } from "utils/api/index";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  bannerData: {} as AdminBannerData,
  fetchAdminBanner: () => {},
  writeAdminBanner: () => {},
  deleteAdminBanner: () => {},
});

export const AdminBannerProvider = ({ children }: Props) => {
  const [bannerData, setBannerData] = useState<AdminBannerData>(
    {} as AdminBannerData
  );

  const fetchAdminBanner = async () => {
    const currentBanner = await getBanner(ADMIN_BANNER_ID);
    const newBannerData = currentBanner?.Item || {};
    setBannerData(newBannerData);
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
    fetchAdminBanner();
  }, []);

  const providerValue = useMemo(
    () => ({
      bannerData,
      fetchAdminBanner,
      writeAdminBanner,
      deleteAdminBanner,
    }),
    [bannerData]
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
