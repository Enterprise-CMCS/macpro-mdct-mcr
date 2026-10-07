// components
import { Box, Heading } from "@chakra-ui/react";
// types
import { ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";

export const ExportedSectionHeading = ({ heading, verbiage }: Props) => {
  const sectionSubHeader = verbiage?.intro?.section || heading;
  const sectionInfo = verbiage?.intro?.exportSectionHeader
    ? null
    : verbiage?.intro?.info;

  const infoHeader: any = verbiage?.intro?.info && verbiage?.intro?.info[0];
  const introContent = infoHeader && infoHeader.content;

  const introHeaderRender = (infoHeader: any, introContent: any) => {
    const introType = infoHeader && infoHeader.type;

    const hideSectionIntroHeader =
      introType === "heading" &&
      introContent !== "Appeals Overview" &&
      introContent !== "Network Adequacy" &&
      introContent !== "Background" &&
      introContent !== "New plan exemption" &&
      introContent !== "Measures and results";

    return !hideSectionIntroHeader && sectionSubHeader;
  };

  return (
    <>
      {sectionSubHeader ? (
        <Heading as="h3" sx={sx.heading.h3}>
          {introHeaderRender(infoHeader, introContent)}
        </Heading>
      ) : null}
      <Box data-testid="exportedSectionHeading" sx={sx.container}>
        {sectionInfo && (
          <>
            <Box sx={sx.info}>
              {typeof sectionInfo === "string"
                ? sectionInfo
                : parseCustomHtml(sectionInfo)}
            </Box>
          </>
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
    fontWeight: "heading_md",
    h2: {
      fontSize: "heading_2xl",
      margin: "1.5rem 0",
    },
    h3: {
      fontSize: "heading_xl",
      margin: "1.5rem 0",
    },
    h4: {
      fontSize: "heading_lg",
    },
  },
  info: {
    p: {
      margin: "1.5rem 0",
    },
    a: {
      color: "primary",
      textDecoration: "underline",
      "&:visited": {
        color: "primary",
        textDecorationColor: "primary",
      },
      "&:hover, &:visited:hover": {
        color: "primary_darker",
        textDecorationColor: "primary_darker",
      },
    },
    h3: {
      fontSize: "heading_xl",
    },
    h4: {
      fontSize: "heading_lg",
      paddingTop: "spacer2",
    },
  },
};
