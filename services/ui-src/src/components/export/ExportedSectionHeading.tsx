// components
import { Box, Heading } from "@chakra-ui/react";
import { Alert } from "components";
// types
import { AlertTypes, ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ExportedSectionHeading = ({ heading, verbiage }: Props) => {
  const sectionSubHeader = verbiage?.intro?.subsection || heading;
  const sectionInfo = verbiage?.intro?.exportSectionHeader
    ? null
    : verbiage?.intro?.info;
  const sectionAlert = verbiage?.intro.alert;

  const introHeaderRender = () => {
    const infoHeader: any = verbiage?.intro?.info && verbiage?.intro?.info[0];
    const introType = infoHeader && infoHeader.type;
    const introContent = infoHeader && infoHeader.content;

    const hideSectionIntroHeader =
      introType === "heading" &&
      introContent !== "Appeals Overview" &&
      introContent !== "Network Adequacy" &&
      introContent !== "New plan exemption";

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
        {sectionAlert && (
          <Alert status={AlertTypes.WARNING} description={sectionAlert} />
        )}
        {sectionInfo && (
          <Box sx={sx.info}>
            {typeof sectionInfo === "string"
              ? sectionInfo
              : parseCustomHtml(sectionInfo)}
          </Box>
        )}
      </Box>
    </>
  );
};

export interface Props {
  heading?: string;
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
    a: {
      color: "base",
      textDecoration: "none",
      "&:hover": {
        color: "base",
        textDecoration: "none",
      },
    },
    h3: {
      fontSize: "xl",
    },
    h4: {
      fontSize: "lg",
      paddingTop: "spacer2",
    },
  },
};
