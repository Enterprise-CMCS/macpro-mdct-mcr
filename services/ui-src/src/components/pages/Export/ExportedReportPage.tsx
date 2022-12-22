import { useContext } from "react";
import { Helmet } from "react-helmet";
// components
import { Box, Heading } from "@chakra-ui/react";
import { ExportedReportSection, ReportContext, Table } from "components";
// utils
import { convertDateUtcToEt } from "utils";
import { States } from "../../../constants";

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
          <Table
            sx={sx.combinedDataTable}
            className="short"
            content={{
              headRow: ["Indicator", "Response"],
              bodyRows: [
                [
                  "<p><strong>Exclusion of CHIP from MCPAR</strong></p><p class='message'>Enrollees in separate CHIP programs funded under Title XXI should not be reported in the MCPAR. Please check this box if the state is unable to remove information about Separate CHIP enrollees from its reporting on this program.</p>",
                  report.combinedData ? "Selected" : "Not Selected",
                ],
              ],
            }}
          />
          {/* report sections */}
          {report.formTemplate.routes.map((section) => (
            <ExportedReportSection section={section} key={section.path} />
          ))}
        </Box>
      )}
    </Box>
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
    p: {
      strong: {
        display: "inline-block",
        marginBottom: "0.5rem",
        fontSize: "md",
      },
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
};
