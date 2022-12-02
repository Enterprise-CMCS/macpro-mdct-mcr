// components
import { Image, Box, Button, Text } from "@chakra-ui/react";
// images
import pdfIcon from "assets/icons/icon_pdf_white.png";

export const StickyBanner = () => {
  return (
    <Box data-testid="stickyBanner" sx={sx.container}>
      <Text>Click below to export or print MCPAR shown here</Text>
      <Button sx={sx.pdfButton}>
        <Image src={pdfIcon} w={5} alt="Download PDF Icon" />
        Download PDF
      </Button>
    </Box>
  );
};

const sx = {
  container: {
    textAlign: "center",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    padding: "3rem 2rem",
    margin: "2rem 0",
    position: "sticky",
    top: "11.125rem",
    background: "white",

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
