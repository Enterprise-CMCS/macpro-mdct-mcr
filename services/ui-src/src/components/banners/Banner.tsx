// components
import { Alert } from "../index";
import { BannerData } from "utils/types/types";

export const Banner = ({ bannerData, ...props }: Props) => {
  const { titleText, description, link } = bannerData;
  return (
    <Alert title={titleText} description={description} link={link} {...props} />
  );
};

interface Props {
  bannerData: BannerData;
  [key: string]: any;
}
