// components
import { Alert } from "components";
// types
import { BannerData } from "types";

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
