// components
import { Alert } from "components";
// types
import { BannerData } from "types/banners";

export const Banner = ({ bannerData, ...props }: Props) => {
  if (bannerData) {
    const { status, title, description, link } = bannerData;
    return (
      bannerData && (
        <Alert
          status={status}
          title={title}
          description={description}
          link={link}
          {...props}
        />
      )
    );
  } else return <></>;
};

interface Props {
  bannerData: BannerData | undefined;
  [key: string]: any;
}
