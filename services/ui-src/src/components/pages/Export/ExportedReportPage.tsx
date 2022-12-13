import { useContext } from "react";
import { Helmet } from "react-helmet";
// components
import { Box, Heading } from "@chakra-ui/react";
import {
  ExportedReportSection,
  ReportContext,
  StickyBanner,
  Table,
} from "components";
// constants
import { States } from "../../../constants";
// verbiage
import verbiage from "verbiage/pages/exportedReport";
// utils
import { convertDateUtcToEt } from "utils";

export const ExportedReportPage = () => {
  const { report } = useContext(ReportContext);
  const { combinedData } = verbiage;

  // metadata
  const getFullStateName = (state: string) => {
    return States[state as keyof typeof States];
  };

  return (
    <Box data-testid="exportedReportPage" sx={sx.container}>
      <StickyBanner />
      {report && (
        <Box sx={sx.innerContainer}>
          <Helmet>
            <title>
              {`Managed Care Program Annual Report (MCPAR) for ${getFullStateName(
                report.state
              )}: ${report.programName}`}
            </title>
            <meta name="author" content="CMS" />
            <meta name="subject" content="Managed Care Program Annual Report" />
            <meta name="language" content="English" />
          </Helmet>

          <Heading as="h1" sx={sx.heading}>
            Managed Care Program Annual Report (MCPAR) for{" "}
            {report.fieldData.stateName}: {report.programName}
          </Heading>

          <Table
            shrinkCells
            sx={sx.metaTable}
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
            sx={sx.chipTable}
            className="short"
            content={{
              headRow: ["Indicator", "Response"],
              bodyRows: [
                [
                  `<p><strong>${combinedData.label}</strong></p><p class='message'>${combinedData.hint}</p>`,
                  report.combinedData ? "Selected" : "Not Selected",
                ],
              ],
            }}
          />

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
  metaTable: {
    margin: "3rem 0",
    maxWidth: "reportPageWidth",
    th: {
      border: "none",
    },
  },
  chipTable: {
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
