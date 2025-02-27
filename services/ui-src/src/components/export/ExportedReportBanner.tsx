// components
import { Box, Button, Image, Spinner, Text } from "@chakra-ui/react";
// types
import { ReportRoute, ReportType } from "types";
// utils
import { useStore } from "utils";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-export";
import mlrVerbiage from "verbiage/pages/mlr/mlr-export";
// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";

export const ExportedReportBanner = () => {
  const { report } = useStore();
  const reportType = (report?.reportType ||
    localStorage.getItem("selectedReportType")) as ReportType;

  const verbiageMap: { [key in ReportType]: any } = {
    MCPAR: mcparVerbiage,
    MLR: mlrVerbiage,
    NAAAR: undefined,
  };

  const verbiage = verbiageMap[reportType];
  const { reportBanner } = verbiage;

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
    marginBottom: "2rem",
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
