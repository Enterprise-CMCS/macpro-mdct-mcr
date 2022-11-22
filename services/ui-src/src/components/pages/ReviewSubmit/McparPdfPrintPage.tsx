import { Box, Heading } from "@chakra-ui/react";
import { StickyBanner, ReportContext } from "components";
import { States } from "../../../constants";

import React, { useContext } from "react";

export const McparPdfPrintPage = () => {
  const data = useContext(ReportContext);
  return (
    <Box sx={sx.container}>
      <StickyBanner />
      {data.report && (
        <Heading as="h1" sx={sx.heading}>
          {`Managed Care Program Annual Report (MCPAR) for ${
            States[data.report.state as keyof typeof States]
          }: ${data.report.programName}`}
        </Heading>
      )}
    </Box>
  );
};

const sx = {
  container: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "0 auto",
  },
  heading: {
    fontWeight: "300",
    lineHeight: "lineHeights.heading",
    fontSize: "2rem",
    maxWidth: "40rem",
  },
};
