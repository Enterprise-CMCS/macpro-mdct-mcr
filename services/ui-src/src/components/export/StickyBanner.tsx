import { useLDClient } from "launchdarkly-react-client-sdk";
// components
import { Box, Button, Image, Text } from "@chakra-ui/react";
// utils
import { featureFlags, printPdf } from "utils";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";

export const StickyBanner = () => {
  // LaunchDarkly
  const ldClient = useLDClient();
  const printExperience = ldClient?.variation(
    featureFlags.PRINT_EXPERIENCE.flag,
    featureFlags.PRINT_EXPERIENCE.defaultValue
  );

  const clickPrint = () => {
    if (printExperience === "prince") {
      printPdf();
    } else {
      window.print();
    }
  };

  return (
    <Box data-testid="stickyBanner" sx={sx.container}>
      <Text>Click below to export or print MCPAR shown here</Text>
      <Button sx={sx.pdfButton} onClick={clickPrint}>
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
      width: "1rem",
      marginRight: "0.5rem",
    },
  },
};
