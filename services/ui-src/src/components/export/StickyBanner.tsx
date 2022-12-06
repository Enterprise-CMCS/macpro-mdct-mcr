// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
// verbiage
import verbiage from "verbiage/pages/exportedReport";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";

export const StickyBanner = () => {
  const { banner } = verbiage;
  return (
    <Box data-testid="stickyBanner" sx={sx.container}>
      <Text>{banner.heading}</Text>
      <Button sx={sx.pdfButton}>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
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
      marginBottom: "1rem",
      fontSize: "xl",
      fontWeight: "bold",
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
