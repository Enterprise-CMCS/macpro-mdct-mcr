import { useContext } from "react";
import { Helmet } from "react-helmet";
// components
import { Box, Heading, Text, Tr, Td } from "@chakra-ui/react";
import { ExportedReportWrapper, ReportContext, Table } from "components";
// utils
import { convertDateUtcToEt } from "utils";
import { States } from "../../../constants";
import { PageTypes, ReportRoute, ReportRouteWithForm } from "types";

export const ExportedReportPage = () => {
  const { report } = useContext(ReportContext);
  const fullStateName = States[report?.state as keyof typeof States];

  return (
    <Box data-testid="exportedReportPage" sx={sx.container}>
      {report && (
        <Box sx={sx.innerContainer}>
          {/* pdf metadata */}
          <Helmet>
            <title>
              {`Managed Care Program Annual Report (MCPAR) for ${fullStateName}: ${report.programName}`}
            </title>
            <meta name="author" content="CMS" />
            <meta name="subject" content="Managed Care Program Annual Report" />
            <meta name="language" content="English" />
          </Helmet>
          {/* report heading */}
          <Heading as="h1" sx={sx.heading}>
            Managed Care Program Annual Report (MCPAR) for{" "}
            {report.fieldData.stateName}: {report.programName}
          </Heading>
          {/* report metadata tables */}
          <Table
            shrinkCells
            sx={sx.metadataTable}
            content={{
              headRow: ["Due Date", "Last edited", "Edited By", "Status"],
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
              headRow: ["Indicator", "Response"],
            }}
          >
            <Tr>
              <Td>
                <Text className="combined-data-title">
                  Exclusion of CHIP from MCPAR
                </Text>
                <Text>
                  Enrollees in separate CHIP programs funded under Title XXI
                  should not be reported in the MCPAR. Please check this box if
                  the state is unable to remove information about Separate CHIP
                  enrollees from its reporting on this program.
                </Text>
              </Td>
              <Td>{report.combinedData ? "Selected" : "Not Selected"}</Td>
            </Tr>
          </Table>
          {/* report sections */}
          <Box mt="5rem">
            {renderReportSections(report.formTemplate.routes)}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const renderReportSections = (reportRoutes: ReportRoute[]) => {
  // recursively render subsections
  const renderSubsection = (subsection: ReportRoute) => (
    <Box key={subsection.path}>
      {/* if subsection has children, recurse */}
      {subsection?.children?.map((child) => renderSubsection(child))}
      {/* if section does not have children, render it */}
      {!subsection?.children && (
        <ExportedReportWrapper section={subsection as ReportRouteWithForm} />
      )}
    </Box>
  );

  // render top-level section headings and subsections
  return reportRoutes.map(
    (section: ReportRoute) =>
      section?.pageType !== PageTypes.REVIEW_SUBMIT && (
        <Box key={section.path}>
          <Heading as="h2" sx={sx.sectionHeading}>
            Section {section.name}
          </Heading>
          {renderSubsection(section)}
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
