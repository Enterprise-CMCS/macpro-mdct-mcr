import { useState, createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "types";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
// api
import { deleteBanner, getBanner, writeBanner } from "utils";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  bannerData: {} as AdminBannerData,
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
  errorMessage: undefined,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const [bannerData, setBannerData] = useState<AdminBannerData>(
    {} as AdminBannerData
  );
  const [error, setError] = useState<string>();

  const fetchAdminBanner = async () => {
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      const newBannerData = currentBanner?.Item || {};
      setBannerData(newBannerData);
    } catch (e: any) {
      // 404 expected when no current banner exists
      if (!e.toString().includes("404")) {
        setError(bannerErrors.GET_BANNER_FAILED);
      }
    }
  };

  const deleteAdminBanner = async () => {
    await deleteBanner(ADMIN_BANNER_ID);
    setBannerData({} as AdminBannerData);
  };

  const writeAdminBanner = async (newBannerData: AdminBannerData) => {
    await writeBanner(newBannerData);
    setBannerData(newBannerData);
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
      errorMessage: error,
    }),
    [bannerData, error]
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
