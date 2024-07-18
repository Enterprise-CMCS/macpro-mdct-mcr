// assets
import pdfIcon from "assets/icons/icon_pdf_white.png";
// components
import { Box, Button, Image, Spinner, Text } from "@chakra-ui/react";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-export";
import mlrVerbiage from "verbiage/pages/mlr/mlr-export";
// utils
import { useStore } from "utils";
// types
import { ReportRoute, ReportType } from "types";

export const ExportedReportBanner = ({ error }: Props) => {
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

  return (
    <Box data-testid="exportedReportBanner" sx={sx.container}>
      <Text>{reportBanner.intro}</Text>
      {!error && report && routesToRender ? (
        <Button sx={sx.pdfButton} onClick={onClickHandler}>
          <Image src={pdfIcon} w={5} alt="PDF Icon" />
          {reportBanner.pdfButton}
        </Button>
      ) : (
        <Spinner />
      )}
    </Box>
  );
};

export interface Props {
  error?: boolean;
}

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
