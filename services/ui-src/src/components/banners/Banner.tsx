// components
import { Alert } from "../index";
import { BannerData } from "utils/types/types";

export const Banner = ({ bannerData }: Props) => {
  const { title, description, link } = bannerData;
  return <Alert title={title} description={description} link={link} />;
};

interface Props {
  bannerData: BannerData;
  [key: string]: any;
}
