// components
import { Box, Button, Image, Spinner, Text } from "@chakra-ui/react";
// types
import { ReportRoute } from "types";
// utils
import { getReportVerbiage, useStore } from "utils";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";

export const ExportedReportBanner = () => {
  const { report } = useStore();

  const { exportVerbiage } = getReportVerbiage(report?.reportType);
  const { reportBanner } = exportVerbiage;

  const routesToRender = report?.formTemplate.routes.filter(
    (route: ReportRoute) => route
  );

  const onClickHandler = () => {
    window?.print();
  };

  // check if the PDF is displaying an error message
  const errorDisplay = window.document.getElementById("error-text");

  return (
    <>
      {!errorDisplay && (
        <Box data-testid="exportedReportBanner" sx={sx.container}>
          <Text>{reportBanner.intro}</Text>
          {report && routesToRender ? (
            <Button sx={sx.pdfButton} onClick={onClickHandler}>
              <Image src={pdfIcon} w={5} alt="PDF Icon" />
              {reportBanner.pdfButton}
            </Button>
          ) : (
            <Spinner />
          )}
        </Box>
      )}
    </>
  );
};

const sx = {
  container: {
    position: "sticky",
    zIndex: "sticky",
    top: "0",
    marginBottom: "spacer4",
    padding: "3rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    ".mobile &": {
      padding: "2rem 1rem",
    },
    ".tablet &, .mobile &": {
      position: "static",
    },
    "@media print": {
      display: "none",
    },
    p: {
      marginBottom: "spacer2",
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
      marginRight: "spacer1",
    },
  },
};
