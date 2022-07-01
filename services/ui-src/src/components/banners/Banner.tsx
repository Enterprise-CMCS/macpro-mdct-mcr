// components
import { Alert } from "../index";
import { BannerData } from "utils/types/types";

export const Banner = ({ bannerData, ...props }: Props) => {
  const { titleText, descriptionText, link } = bannerData;
  return (
    <Alert
      title={titleText}
      description={descriptionText}
      link={link}
      {...props}
    />
  );
};

interface Props {
  bannerData: BannerData;
  [key: string]: any;
}
