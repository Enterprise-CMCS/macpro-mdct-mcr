// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { SpreadsheetWidget } from "components";
// types
import { ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ExportedSectionHeading = ({
  heading,
  reportType,
  verbiage,
}: Props) => {
  const sectionHeading = verbiage?.intro?.exportSectionHeader
    ? verbiage?.intro?.exportSectionHeader
    : verbiage?.intro?.section;
  const sectionSubHeader = verbiage?.intro?.subsection || heading;
  const sectionInfo = verbiage?.intro?.exportSectionHeader
    ? null
    : verbiage?.intro?.info;
  const sectionSpreadsheet = verbiage?.intro?.spreadsheet;

  return (
    <Box data-testid="exportedSectionHeading" sx={sx.container}>
      {sectionHeading ? (
        <Heading as="h2" sx={sx.heading.h2}>
          {sectionHeading}
        </Heading>
      ) : null}
      {sectionSubHeader ? (
        <Heading as="h3" sx={sx.heading.h3}>
          {sectionSubHeader}
        </Heading>
      ) : null}
      {sectionInfo && (
        <Box sx={sx.info}>
          <Text>
            {typeof sectionInfo === "string"
              ? sectionInfo
              : parseCustomHtml(sectionInfo)}
          </Text>
        </Box>
      )}
      {sectionSpreadsheet && (
        <Box sx={sx.spreadsheet}>
          <SpreadsheetWidget
            description={sectionSpreadsheet}
            isPdf={true}
            reportType={reportType}
          />
        </Box>
      )}
    </Box>
  );
};

export interface Props {
  heading: string;
  reportType?: string;
  verbiage?: ReportPageVerbiage;
}

const sx = {
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  heading: {
    fontWeight: "bold",
    h2: {
      fontSize: "xl",
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "lg",
      margin: "1.5rem 0",
    },
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
    "@media print": {
      pageBreakAfter: "avoid",
    },
  },
};
