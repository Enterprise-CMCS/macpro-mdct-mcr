import { useFlags } from "launchdarkly-react-client-sdk";
// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
// utils
import { printPdf } from "utils";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";

export const StickyBanner = () => {
  const printExperience = useFlags()?.printExperience;

  const onClickHandler = () => {
    if (printExperience === "prince") printPdf();
    else window?.print();
  };

  return (
    <Box data-testid="stickyBanner" sx={sx.container}>
      <Text>Click below to export or print MCPAR shown here</Text>
      <Button sx={sx.pdfButton} onClick={onClickHandler}>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
        Download PDF
      </Button>
    </Box>
  );
};

const sx = {
  container: {
    position: "sticky",
    zIndex: "sticky",
    top: "0",
    marginBottom: "2rem",
    padding: "3rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    ".mobile &": {
      padding: "2rem 1rem",
    },
    "@media print": {
      display: "none",
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
      width: "1rem",
      marginRight: "0.5rem",
    },
  },
};
