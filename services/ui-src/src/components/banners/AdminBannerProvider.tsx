import { useState, createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "utils/types/types";
import { bannerId, GET_BANNER_FAILED } from "../../utils/constants/constants";
import { errorHandler } from "utils/errors/errorHandler";
// api
import { deleteBanner, getBanner, writeBanner } from "utils/api/index";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  bannerData: {} as AdminBannerData,
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
  errorData: null,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const [bannerData, setBannerData] = useState<AdminBannerData>(
    {} as AdminBannerData
  );
  const [errorState, setErrorState] = useState(null);

  const fetchAdminBanner = async () => {
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      const newBannerData = currentBanner?.Item || {};
      setBannerData(newBannerData);
    } catch (error) {
      errorHandler(error, setErrorState, GET_BANNER_FAILED);
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

  useEffect(() => {
    fetchAdminBanner();
  }, []);

  const providerValue = useMemo(
    () => ({
      bannerData,
      fetchAdminBanner,
      writeAdminBanner,
      deleteAdminBanner,
      errorData: errorState,
    }),
    [bannerData, errorState]
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
