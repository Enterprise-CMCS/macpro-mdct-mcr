// components
import { Alert } from "../index";
import { BannerData } from "utils/types/types";

export const Banner = ({ bannerData, ...props }: Props) => {
  const { title, description, link } = bannerData;
  return (
    <Alert title={title} description={description} link={link} {...props} />
  );
};

interface Props {
  bannerData: BannerData;
  [key: string]: any;
}
