import { useState, useEffect } from "react";
// components
import { Banner } from "../index";
import { Collapse } from "@chakra-ui/react";
// utils
import {
  checkBannerActiveDates,
  makeStartDate,
  makeEndDate,
} from "utils/banner/banner";
import { BannerShape } from "utils/types/types";
// api
import { getBanner, writeBanner } from "utils/api/requestMethods/banner";

const ADMIN_BANNER_ID = process.env.REACT_APP_BANNER_ID!;
const temporaryBanner: BannerShape = {
  key: ADMIN_BANNER_ID,
  title: "Welcome to the new Managed Care Reporting tool!",
  description: "Each state must submit one report per program.",
  startDate: makeStartDate({ year: 2022, month: 1, day: 1 }),
  endDate: makeEndDate({ year: 2022, month: 12, day: 31 }),
};

export const AdminBanner = ({ onBannerLoaded = () => {} }: Props) => {
  const [bannerData, setBannerData] = useState<BannerShape | null>(null);
  const [isBannerActive, setIsBannerActive] = useState<boolean>(false);

  const fetchBannerData = async () => {
    const currentBanner = await getBanner(ADMIN_BANNER_ID);
    if (currentBanner) {
      onBannerLoaded(currentBanner.Item);
      setBannerData(currentBanner.Item);
    }
  };

  const augmentBannerData = () => {
    setIsBannerActive(
      checkBannerActiveDates(bannerData?.startDate!, bannerData?.endDate!)
    );
  };

  useEffect(() => {
    // TODO: remove before phase1 deployment
    writeBanner(temporaryBanner);
    fetchBannerData();
  }, []);

  useEffect(() => {
    if (bannerData) augmentBannerData();
  }, [bannerData]);

  return (
    <Collapse in={isBannerActive}>
      {isBannerActive && (
        <Banner
          title={bannerData!.title}
          description={bannerData!.description}
        />
      )}
    </Collapse>
  );
};

interface Props {
  onBannerLoaded?: Function;
}
