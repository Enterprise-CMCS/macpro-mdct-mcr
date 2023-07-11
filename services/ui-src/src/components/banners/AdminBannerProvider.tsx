import { useState, createContext, ReactNode, useMemo, useEffect } from "react";
// utils
import { AdminBannerData, AdminBannerShape } from "types/banners";
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
// api
import { deleteBanner, getBanner, writeBanner } from "utils";
import { useStore } from "utils/state/useStore";

const ADMIN_BANNER_ID = bannerId;

export const AdminBannerContext = createContext<AdminBannerShape>({
  bannerData: undefined as AdminBannerData | undefined,
  fetchAdminBanner: Function,
  writeAdminBanner: Function,
  deleteAdminBanner: Function,
  isLoading: false as boolean,
  errorMessage: undefined,
});

export const AdminBannerProvider = ({ children }: Props) => {
  const bannerData = useStore((state) => state.bannerData);
  const setBannerData = useStore((state) => state.setBannerData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchAdminBanner = async () => {
    setIsLoading(true);
    try {
      const currentBanner = await getBanner(ADMIN_BANNER_ID);
      const newBannerData = currentBanner?.Item || {};
      setBannerData(newBannerData);
    } catch (e: any) {
      setIsLoading(false);
      // 404 expected when no current banner exists
      if (!e.toString().includes("404")) {
        setError(bannerErrors.GET_BANNER_FAILED);
      }
    }
    setIsLoading(false);
  };

  const deleteAdminBanner = async () => {
    await deleteBanner(ADMIN_BANNER_ID);
    setBannerData(undefined);
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
      isLoading: isLoading,
      errorMessage: error,
    }),
    [bannerData, isLoading, error]
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
