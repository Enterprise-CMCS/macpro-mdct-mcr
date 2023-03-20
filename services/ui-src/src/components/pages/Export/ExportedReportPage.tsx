import { useContext } from "react";
import { Helmet } from "react-helmet";
// components
import { Box, Heading, Text, Tr, Td, Center } from "@chakra-ui/react";
import {
  ExportedReportWrapper,
  ExportedSectionHeading,
  ReportContext,
  Table,
} from "components";
import { Spinner } from "@cmsgov/design-system";
// utils
import { convertDateUtcToEt } from "utils";
import { States } from "../../../constants";
import { PageTypes, ReportRoute, ReportRouteWithForm } from "types";

// verbiage
import verbiage from "verbiage/pages/export";

export const ExportedReportPage = () => {
  const { report } = useContext(ReportContext);
  const { metadata, reportPage, tableHeaders } = verbiage;
  const fullStateName = States[report?.state as keyof typeof States];
  const routesToRender = report?.formTemplate.routes.filter(
    (route: ReportRoute) => route
  );

  return (
    <Box data-testid="exportedReportPage" sx={sx.container}>
      {(report && routesToRender && (
        <Box sx={sx.innerContainer}>
          {/* pdf metadata */}
          <Helmet>
            <title>
              {`${reportPage.heading} ${fullStateName}: ${report.programName}`}
            </title>
            <meta name="author" content={metadata.author} />
            <meta name="subject" content={metadata.subject} />
            <meta name="language" content={metadata.language} />
          </Helmet>
          {/* report heading */}
          <Heading as="h1" sx={sx.heading}>
            {reportPage.heading}
            {report.fieldData.stateName}: {report.programName}
          </Heading>
          {/* report metadata tables */}
          <Table
            sx={sx.metadataTable}
            content={{
              headRow: [
                reportPage.metadataTableHeaders.dueDate,
                reportPage.metadataTableHeaders.lastEdited,
                reportPage.metadataTableHeaders.editedBy,
                reportPage.metadataTableHeaders.status,
              ],
              bodyRows: [
                [
                  convertDateUtcToEt(report.dueDate),
                  convertDateUtcToEt(report.lastAltered),
                  report.lastAlteredBy,
                  report.status,
                ],
              ],
            }}
          />
          {/* combined data table */}
          <Table
            sx={sx.combinedDataTable}
            className="short"
            content={{
              headRow: [tableHeaders.indicator, tableHeaders.response],
            }}
          >
            <Tr>
              <Td>
                <Text className="combined-data-title">
                  {reportPage.combinedDataTable.title}
                </Text>
                <Text>{reportPage.combinedDataTable.subtitle}</Text>
              </Td>
              <Td>{report.combinedData ? "Selected" : "Not Selected"}</Td>
            </Tr>
          </Table>
          {/* report sections */}
          {renderReportSections(report.formTemplate.routes)}
        </Box>
      )) || (
        <Center>
          <Spinner size="big" />
        </Center>
      )}
    </Box>
  );
};

export const renderReportSections = (reportRoutes: ReportRoute[]) => {
  // recursively render sections
  const renderSection = (section: ReportRoute) => {
    const childSections = section?.children;
    return (
      <Box key={section.path}>
        {/* if section has children, recurse */}
        {childSections?.map((child: ReportRoute) => renderSection(child))}
        {/* if section does not have children and has content to render, render it */}
        {!childSections && (
          <Box>
            <ExportedSectionHeading
              heading={section.verbiage?.intro?.subsection || section.name}
              verbiage={section.verbiage || undefined}
            />
            <ExportedReportWrapper section={section as ReportRouteWithForm} />
          </Box>
        )}
      </Box>
    );
  };

  return reportRoutes.map(
    (section: ReportRoute) =>
      section?.pageType !== PageTypes.REVIEW_SUBMIT && (
        <Box key={section.path} mt="5rem">
          {/*  render top-level section headings */}
          <Heading as="h2" sx={sx.sectionHeading}>
            Section {section.name}
          </Heading>
          {renderSection(section)}
        </Box>
      )
  );
};

export const sx = {
  container: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "0 auto",
  },
  innerContainer: {
    width: "100%",
    maxWidth: "40rem",
    margin: "0 auto 0 0",
  },
  heading: {
    fontWeight: "300",
    lineHeight: "lineHeights.heading",
    fontSize: "4xl",
  },
  metadataTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    th: {
      border: "none",
    },
  },
  combinedDataTable: {
    marginBottom: "1rem",
    ".combined-data-title": {
      display: "inline-block",
      marginBottom: "0.5rem",
      fontSize: "md",
      fontWeight: "bold",
    },
    "th, td": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      paddingLeft: "0.5rem",
    },
    tr: {
      "th, td": {
        "&:first-of-type": {
          ".desktop &": {
            paddingLeft: "6rem",
          },
        },
        "&:nth-last-of-type(2)": {
          width: "19.5rem",
        },
      },
    },
  },
  sectionHeading: {
    fontWeight: "bold",
    fontSize: "2xl",
    marginBottom: "2xl",
  },
};
