// components
import { Image, Box, Button, Text } from "@chakra-ui/react";
// images
import pdfIcon from "assets/icons/icon_pdf_white.png";
//content
import verbiage from "verbiage/pages/exportedReport";

export const StickyBanner = () => {
  const { banner } = verbiage;
  return (
    <Box data-testid="stickyBanner" sx={sx.container}>
      <Text>{banner.heading}</Text>
      <Button sx={sx.pdfButton}>
        <Image src={pdfIcon} w={5} alt={banner.buttonCopy} />
        {banner.buttonCopy}
      </Button>
    </Box>
  );
};

const sx = {
  container: {
    position: "sticky",
    top: "11.125rem",
    margin: "2rem 0",
    padding: "3rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",

    ".mobile &": {
      padding: "2rem 1rem",
    },
    p: {
      fontSize: "xl",
      fontWeight: "bold",
      marginBottom: "1rem",
      ".mobile &": {
        fontSize: "lg",
      },
    },
  },
  pdfButton: {
    img: {
      marginRight: "0.5rem",
    },
  },
};
