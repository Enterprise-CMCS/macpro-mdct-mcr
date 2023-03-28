// components
import { Box, Heading } from "@chakra-ui/react";
import { SpreadsheetWidget } from "components";
// utils
import { parseCustomHtml } from "utils";
import { ReportPageVerbiage } from "types";

export const ExportedSectionHeading = ({ heading, verbiage }: Props) => {
  const sectionHeading = verbiage?.intro?.subsection || heading;
  const sectionInfo = verbiage?.intro?.info;
  const sectionSpreadsheet = verbiage?.intro?.spreadsheet;

  return (
    <Box data-testid="exportedSectionHeading">
      <Heading as="h3" sx={sx.heading}>
        {sectionHeading}
      </Heading>
      {sectionInfo && <Box sx={sx.info}>{parseCustomHtml(sectionInfo)}</Box>}
      {sectionSpreadsheet && (
        <Box sx={sx.spreadsheet}>
          <SpreadsheetWidget description={sectionSpreadsheet} alt="" />
        </Box>
      )}
    </Box>
  );
};

export interface Props {
  heading: string;
  verbiage?: ReportPageVerbiage;
}

const sx = {
  heading: {
    margin: "1.5rem 0",
    fontSize: "xl",
    fontWeight: "bold",
  },
  info: {
    p: {
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "lg",
    },
  },
  spreadsheet: {
    margin: "1.5rem 0",
  },
};
