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
  const sectionSubHeader = verbiage?.intro?.subsection || heading;
  const sectionInfo = verbiage?.intro?.exportSectionHeader
    ? null
    : verbiage?.intro?.info;
  const sectionSpreadsheet = verbiage?.intro?.spreadsheet;

  const introHeaderRender = () => {
    const infoHeader: any = verbiage?.intro?.info && verbiage?.intro?.info[0];
    const introType = infoHeader && infoHeader.type;
    const introContent = infoHeader && infoHeader.content;

    const hideSectionIntroHeader =
      introType === "heading" &&
      introContent !== "Appeals Overview" &&
      introContent !== "Network Adequacy";

    return !hideSectionIntroHeader && sectionSubHeader;
  };

  return (
    <>
      {sectionSubHeader ? (
        <Heading as="h3" sx={sx.heading.h3}>
          {introHeaderRender()}
        </Heading>
      ) : null}
      <Box data-testid="exportedSectionHeading" sx={sx.container}>
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
    </>
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
      fontSize: "2xl",
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "xl",
      margin: "1.5rem 0",
    },
    h4: {
      fontSize: "lg",
    },
  },
  info: {
    p: {
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "xl",
    },
    h4: {
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
