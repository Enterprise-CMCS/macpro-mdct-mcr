// components
import { Box } from "@chakra-ui/react";
import { Alert } from "components";
// types
import { BannerData } from "types/banners";
// utils
import { parseAllowedHtml } from "utils";

export const Banner = ({ bannerData, ...props }: Props) => {
  if (bannerData) {
    const { status, title, description, link } = bannerData;
    return (
      bannerData && (
        <Alert status={status} title={title} link={link} {...props}>
          <Box>{parseAllowedHtml(description)}</Box>
        </Alert>
      )
    );
  } else return <></>;
};

interface Props {
  bannerData: BannerData | undefined;
  [key: string]: any;
}
