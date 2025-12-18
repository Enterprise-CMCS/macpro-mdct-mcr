// components
import { Box, Heading } from "@chakra-ui/react";
import { Alert } from "components";
import { useFlags } from "launchdarkly-react-client-sdk";
// types
import { AlertTypes, CustomHtmlElement, ReportPageVerbiage } from "types";
// utils
import { parseCustomHtml } from "utils";
// verbiage
import accordion from "verbiage/pages/accordion";

export const ExportedSectionHeading = ({ heading, verbiage }: Props) => {
  const sectionSubHeader = verbiage?.intro?.subsection || heading;
  const sectionInfo = verbiage?.intro?.exportSectionHeader
    ? null
    : verbiage?.intro?.info;
  const sectionAlert = verbiage?.intro.alert;

  const infoHeader: any = verbiage?.intro?.info && verbiage?.intro?.info[0];
  const introContent = infoHeader && infoHeader.content;

  // LaunchDarkly
  const newQualityMeasuresSectionEnabled =
    useFlags()?.newQualityMeasuresSectionEnabled;
  const isQualityMeasuresResultsPage = introContent === "Measures and results";

  const introHeaderRender = (infoHeader: any, introContent: any) => {
    const introType = infoHeader && infoHeader.type;

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
          {introHeaderRender(infoHeader, introContent)}
        </Heading>
      ) : null}
      <Box data-testid="exportedSectionHeading" sx={sx.container}>
        {sectionAlert && (
          <Alert status={AlertTypes.WARNING} description={sectionAlert} />
        )}
        {sectionInfo && (
          <>
            <Box sx={sx.info}>
              {typeof sectionInfo === "string"
                ? sectionInfo
                : parseCustomHtml(sectionInfo)}
            </Box>
            <Box sx={sx.instructions}>
              {newQualityMeasuresSectionEnabled &&
                isQualityMeasuresResultsPage && (
                  <>
                    {parseCustomHtml(
                      accordion.MCPAR.formIntro.intro as CustomHtmlElement[]
                    )}
                  </>
                )}
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
  instructions: {
    color: "gray",
    p: {
      ":nth-of-type(odd)": {
        margin: "1.25rem auto",
      },
    },
    a: {
      color: "gray",
      textDecoration: "none",
      cursor: "text",
      "&:hover": {
        color: "gray",
        textDecoration: "none",
      },
    },
  },
};
